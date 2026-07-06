from fastapi import APIRouter, Query
from app.forecasting.revenue_forecast import forecast_revenue, forecast_demand

router = APIRouter(prefix="/forecast", tags=["forecast"])


@router.get("/{business_id}")
def get_forecast(business_id: str, metric: str = Query("revenue"), horizon: int = Query(30)):
    if metric == "revenue":
        series = forecast_revenue(business_id, horizon_days=horizon)
    else:
        series = forecast_demand(business_id, horizon_days=horizon)
    return {"metric": metric, "horizon_days": horizon, "series": series}
