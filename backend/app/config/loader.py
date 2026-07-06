"""
Loads the active industry config (YAML) and exposes it as a typed object.
This is the core of CoreSight's "config-driven, not code-driven" pitch:
swap the ACTIVE_INDUSTRY env var and every downstream engine (ingestion,
KPIs, forecasting, alerts, copilot) adapts without a code change.
"""
import os
from pathlib import Path
from functools import lru_cache
import yaml

CONFIG_DIR = Path(__file__).parent / "industries"


class IndustryConfig:
    def __init__(self, raw: dict):
        self.raw = raw
        self.industry: str = raw["industry"]
        self.display_name: str = raw.get("display_name", self.industry.title())
        self.required_columns: dict = raw.get("required_columns", {})
        self.kpis: list = raw.get("kpis", [])
        self.alert_rules: dict = raw.get("alert_rules", {})
        self.forecast_targets: list = raw.get("forecast_targets", [])
        self.copilot_context: str = raw.get("copilot_context", "")

    def sales_columns(self) -> list:
        return self.required_columns.get("sales", [])

    def inventory_columns(self) -> list:
        return self.required_columns.get("inventory", [])


@lru_cache()
def get_industry_config(industry: str | None = None) -> IndustryConfig:
    industry = industry or os.getenv("ACTIVE_INDUSTRY", "retail")
    path = CONFIG_DIR / f"{industry}.yaml"
    if not path.exists():
        raise FileNotFoundError(
            f"No config found for industry '{industry}'. "
            f"Add one at {path} following the shape of retail.yaml."
        )
    with open(path, "r") as f:
        raw = yaml.safe_load(f)
    return IndustryConfig(raw)


def list_available_industries() -> list[str]:
    return [p.stem for p in CONFIG_DIR.glob("*.yaml")]
