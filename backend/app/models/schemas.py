"""Pydantic request/response schemas shared across API routes."""
from pydantic import BaseModel
from typing import Optional, Any


class UploadResult(BaseModel):
    business_id: str
    dataset: str
    rows_received: int
    rows_inserted: int
    rows_rejected: int
    issues: list[str] = []


class KpiSnapshot(BaseModel):
    date: str
    revenue: float
    profit: float
    average_order_value: float
    orders: int


class DashboardResponse(BaseModel):
    business_id: str
    industry: str
    latest: KpiSnapshot
    revenue_series: list[dict]
    top_products: list[dict]
    worst_products: list[dict]
    alerts_count: int


class ForecastPoint(BaseModel):
    date: str
    value: float
    is_forecast: bool
    confidence: Optional[float] = None


class ForecastResponse(BaseModel):
    metric: str
    horizon_days: int
    series: list[ForecastPoint]


class Alert(BaseModel):
    severity: str
    message: str
    created_at: str


class CopilotRequest(BaseModel):
    business_id: str
    question: str


class CopilotResponse(BaseModel):
    answer: str
    computed_facts: dict[str, Any]
