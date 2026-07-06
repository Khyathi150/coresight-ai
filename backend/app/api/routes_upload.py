from fastapi import APIRouter, UploadFile, File, HTTPException
from app.config.loader import get_industry_config
from app.ingestion.loaders import process_upload
from app.models.schemas import UploadResult

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/{business_id}", response_model=UploadResult)
async def upload_dataset(business_id: str, dataset: str, file: UploadFile = File(...)):
    if dataset not in ("sales", "inventory"):
        raise HTTPException(400, "dataset must be 'sales' or 'inventory'")

    config = get_industry_config()
    contents = await file.read()
    result = process_upload(contents, dataset, business_id, config)

    return UploadResult(
        business_id=business_id,
        dataset=dataset,
        rows_received=result["rows_received"],
        rows_inserted=result["rows_inserted"],
        rows_rejected=result["rows_rejected"],
        issues=result["issues"],
    )
