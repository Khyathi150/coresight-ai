from fastapi import APIRouter, Query
from fastapi.responses import Response
from app.config.loader import get_industry_config
from app.reports.pdf_generator import generate_report_pdf

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{business_id}/generate")
def generate_report(business_id: str, report_type: str = Query("weekly"), business_name: str = Query("Your Business")):
    config = get_industry_config()
    pdf_bytes = generate_report_pdf(business_id, business_name, report_type, config)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{report_type}_report.pdf"'},
    )
