from fastapi import APIRouter
from app.config.loader import get_industry_config
from app.kpi_engine.compute import compute_daily_kpis, top_and_worst_products
from app.anomaly.detect import all_alerts

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/{business_id}")
def get_dashboard(business_id: str):
    config = get_industry_config()
    daily = compute_daily_kpis(business_id)
    top, worst = top_and_worst_products(business_id)
    alerts = all_alerts(business_id, config)

    latest = daily.tail(1).to_dict(orient="records")
    latest = latest[0] if latest else {
        "date": None, "revenue": 0, "profit": 0, "average_order_value": 0, "orders": 0
    }

    return {
        "business_id": business_id,
        "industry": config.industry,
        "latest": latest,
        "revenue_series": daily.to_dict(orient="records"),
        "top_products": top,
        "worst_products": worst,
        "alerts_count": len(alerts),
    }
