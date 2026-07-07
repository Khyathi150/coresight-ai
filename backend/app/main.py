from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.loader import get_industry_config, list_available_industries
from app.api import (
    routes_upload,
    routes_dashboard,
    routes_forecast,
    routes_alerts,
    routes_copilot,
    routes_reports,
    routes_reports_data,
)

app = FastAPI(
    title="CoreSight AI",
    description="AI-powered business intelligence, forecasting, and decision support — config-driven across industries.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten before production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_upload.router)
app.include_router(routes_dashboard.router)
app.include_router(routes_forecast.router)
app.include_router(routes_alerts.router)
app.include_router(routes_copilot.router)
app.include_router(routes_reports.router)
app.include_router(routes_reports_data.router)


@app.get("/")
def root():
    config = get_industry_config()
    return {
        "status": "online",
        "active_industry": config.industry,
        "available_industries": list_available_industries(),
    }


@app.get("/health")
def health():
    return {"status": "ok"}
