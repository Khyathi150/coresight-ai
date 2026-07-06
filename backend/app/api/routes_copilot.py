from fastapi import APIRouter, HTTPException
from app.config.loader import get_industry_config
from app.copilot.engine import ask
from app.models.schemas import CopilotRequest, CopilotResponse

router = APIRouter(prefix="/copilot", tags=["copilot"])


@router.post("/ask", response_model=CopilotResponse)
def ask_copilot(payload: CopilotRequest):
    try:
        config = get_industry_config()
        result = ask(payload.business_id, payload.question, config)

        return CopilotResponse(
            answer=result["answer"],
            computed_facts=result["computed_facts"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))