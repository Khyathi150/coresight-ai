"""
Generates a branded PDF report (daily/weekly/monthly) from a Jinja2 HTML
template rendered with WeasyPrint. No paid service involved.
"""

from jinja2 import Template

try:
    from weasyprint import HTML
except Exception:
    HTML = None

from io import BytesIO
from app.kpi_engine.compute import compute_daily_kpis, top_and_worst_products
from app.forecasting.revenue_forecast import forecast_revenue
from app.anomaly.detect import all_alerts
from app.config.loader import IndustryConfig

TEMPLATE = """
<html>
<head>
<style>
  body { font-family: 'Helvetica', sans-serif; color: #12162B; padding: 40px; }
  h1 { color: #E08D2C; margin-bottom: 0; }
  .sub { color: #6B7280; margin-top: 4px; }
  .section { margin-top: 28px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
  .alert { color: #B23A2E; font-size: 13px; margin: 4px 0; }
</style>
</head>
<body>
  <h1>CoreSight AI — {{ report_type }} Report</h1>
  <p class="sub">{{ business_name }} · Generated {{ generated_at }}</p>

  <div class="section">
    <h3>Revenue (last 7 entries)</h3>
    <table>
      <tr><th>Date</th><th>Revenue</th><th>Profit</th><th>AOV</th></tr>
      {% for row in kpis %}
      <tr><td>{{ row.date }}</td><td>{{ row.revenue }}</td><td>{{ row.profit }}</td><td>{{ row.average_order_value }}</td></tr>
      {% endfor %}
    </table>
  </div>

  <div class="section">
    <h3>Top Products</h3>
    <table>
      <tr><th>Product</th><th>Revenue</th><th>Units Sold</th></tr>
      {% for p in top_products %}
      <tr><td>{{ p.product or p.dish }}</td><td>{{ p.revenue }}</td><td>{{ p.units_sold }}</td></tr>
      {% endfor %}
    </table>
  </div>

  <div class="section">
    <h3>Active Alerts</h3>
    {% for a in alerts %}
    <p class="alert">⚠ {{ a.message }}</p>
    {% else %}
    <p>No active alerts.</p>
    {% endfor %}
  </div>

  <div class="section">
    <h3>14-Day Revenue Forecast (final value)</h3>
    <p>{{ forecast_summary }}</p>
  </div>
</body>
</html>
"""


def generate_report_pdf(business_id: str, business_name: str, report_type: str, config: IndustryConfig) -> bytes:
    if HTML is None:
        raise RuntimeError(
            "PDF generation is unavailable because WeasyPrint dependencies are missing."
        )

    daily = compute_daily_kpis(business_id)

    daily["date"] = pd.to_datetime(daily["date"])

    if report_type == "daily":
        report_df = daily.tail(1)

    elif report_type == "weekly":
        report_df = daily.tail(7)

    elif report_type == "monthly":
        report_df = (
            daily.set_index("date")
            .resample("ME")
            .agg({
                "revenue": "sum",
                "profit": "sum",
                "orders": "sum",
            })
            .reset_index()
        )

        report_df["average_order_value"] = (
            report_df["revenue"] / report_df["orders"]
        ).round(2)

    else:
        report_df = daily.tail(7)

    kpis = report_df.to_dict(orient="records")

    top, _ = top_and_worst_products(business_id)
    alerts = all_alerts(business_id, config)
    forecast = forecast_revenue(business_id, horizon_days=14)

    forecast_summary = (
        f"{forecast[-1]['value']} (confidence {forecast[-1]['confidence']})"
        if forecast
        else "Not enough data yet"
    )

    html_str = Template(TEMPLATE).render(
        business_name=business_name,
        report_type=report_type.title(),
        generated_at=__import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M"),
        kpis=kpis,
        top_products=top,
        alerts=alerts,
        forecast_summary=forecast_summary,
    )

    buffer = BytesIO()
    HTML(string=html_str).write_pdf(buffer)
    return buffer.getvalue()