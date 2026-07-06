from fastapi import APIRouter
from app.config.loader import get_industry_config
from app.anomaly.detect import all_alerts

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/{business_id}")
def get_alerts(business_id: str):
    config = get_industry_config()
    return {"alerts": all_alerts(business_id, config)}
