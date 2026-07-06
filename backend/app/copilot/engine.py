"""
The actual compute-then-narrate pipeline the /copilot/ask route calls:
  1. classify what the question is about (very lightweight keyword routing)
  2. pull the relevant computed facts from the KPI/forecast/anomaly engines
  3. hand ONLY those facts to Groq for narration
"""
from app.kpi_engine.compute import compute_daily_kpis, top_and_worst_products, inventory_health
from app.forecasting.revenue_forecast import forecast_revenue
from app.anomaly.detect import all_alerts
from app.copilot.prompt_templates import build_messages
from app.copilot.groq_client import narrate
from app.config.loader import IndustryConfig


def gather_facts(business_id: str, question: str, config: IndustryConfig) -> dict:
    q = question.lower()
    facts: dict = {}

    daily = compute_daily_kpis(business_id)
    if not daily.empty:
        facts["latest_kpis"] = daily.tail(3).to_dict(orient="records")

    if any(k in q for k in ["revenue", "sales", "fall", "drop", "profit", "why"]):
        facts["alerts"] = all_alerts(business_id, config)

    if any(k in q for k in ["product", "reorder", "stock", "inventory", "expir"]):
        top, worst = top_and_worst_products(business_id)
        facts["top_products"] = top[:5]
        facts["worst_products"] = worst[:5]
        facts["inventory_health"] = inventory_health(business_id)

    if any(k in q for k in ["forecast", "next", "predict", "expect"]):
        facts["revenue_forecast"] = forecast_revenue(business_id, horizon_days=5)

    if not facts:
        # fallback: always give at least the recent trend
        facts["latest_kpis"] = daily.tail(7).to_dict(orient="records") if not daily.empty else []

    return facts


def ask(business_id: str, question: str, config: IndustryConfig) -> dict:
    facts = gather_facts(business_id, question, config)
    messages = build_messages(question, facts, config)
    answer = narrate(messages)
    return {"answer": answer, "computed_facts": facts}
