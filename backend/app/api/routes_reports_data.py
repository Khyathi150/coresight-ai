from fastapi import APIRouter

from app.kpi_engine.compute import (
    compute_daily_kpis,
    compute_weekly_kpis,
    compute_monthly_kpis,
    top_and_worst_products,
)

from app.forecasting.revenue_forecast import forecast_revenue

router = APIRouter(prefix="/report-data", tags=["reports"])


@router.get("/{business_id}/{report_type}")
def get_report_data(business_id: str, report_type: str):

    if report_type == "daily":
        chart = compute_daily_kpis(business_id).tail(1)
        forecast = forecast_revenue(business_id, horizon_days=1)

    elif report_type == "weekly":
        chart = compute_daily_kpis(business_id).tail(7)
        forecast = forecast_revenue(business_id, horizon_days=7)

    elif report_type == "monthly":
        chart = compute_monthly_kpis(business_id)
        forecast = forecast_revenue(business_id, horizon_days=30)

    else:
        chart = compute_daily_kpis(business_id).tail(7)
        forecast = forecast_revenue(business_id, horizon_days=7)

    top, worst = top_and_worst_products(business_id)

    return {
        "chart": chart.to_dict(orient="records"),
        "forecast": forecast,
        "top_products": top,
        "worst_products": worst,
    }