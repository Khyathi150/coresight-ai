"""
Rule-based + statistical anomaly detection.
Deliberately simple (z-score + config thresholds) so it's explainable —
every alert can point to the exact number that triggered it.
"""
import pandas as pd
import numpy as np
from app.config.loader import IndustryConfig
from app.kpi_engine.compute import compute_daily_kpis, inventory_health


def detect_revenue_anomalies(business_id: str, config: IndustryConfig) -> list[dict]:
    daily = compute_daily_kpis(business_id)
    if len(daily) < 3:
        return []

    daily["pct_change"] = daily["revenue"].pct_change() * 100
    threshold = config.alert_rules.get("revenue_drop_pct", -10)

    alerts = []
    for _, row in daily.iterrows():
        if pd.notna(row["pct_change"]) and row["pct_change"] <= threshold:
            alerts.append({
                "severity": "high",
                "message": f"Revenue dropped {abs(row['pct_change']):.1f}% on {row['date']}",
                "created_at": row["date"],
            })

    # simple z-score outlier check as a second signal
    mean, std = daily["revenue"].mean(), daily["revenue"].std()
    if std and std > 0:
        daily["z"] = (daily["revenue"] - mean) / std
        for _, row in daily[daily["z"] < -2].iterrows():
            alerts.append({
                "severity": "medium",
                "message": f"Revenue on {row['date']} is statistically unusual (z={row['z']:.2f})",
                "created_at": row["date"],
            })

    return alerts


def detect_inventory_alerts(business_id: str) -> list[dict]:
    health = inventory_health(business_id)
    alerts = []
    for item in health["low_stock"]:
        name = item.get("product") or item.get("ingredient", "item")
        alerts.append({
            "severity": "high",
            "message": f"{name} is below reorder level ({item.get('stock_qty')} left)",
            "created_at": str(pd.Timestamp.now().date()),
        })
    for item in health["expiring_soon"]:
        name = item.get("product") or item.get("ingredient", "item")
        alerts.append({
            "severity": "medium",
            "message": f"{name} expires soon ({item.get('expiry_date')})",
            "created_at": str(pd.Timestamp.now().date()),
        })
    return alerts


def all_alerts(business_id: str, config: IndustryConfig) -> list[dict]:
    return detect_revenue_anomalies(business_id, config) + detect_inventory_alerts(business_id)
