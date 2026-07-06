"""
Revenue forecasting using a weighted moving average + trend.
Returns only the last 30 days of history so forecast horizons
(7/14/30 days) are visually different.
"""

import pandas as pd
import numpy as np

from app.kpi_engine.compute import compute_daily_kpis


def forecast_revenue(business_id: str, horizon_days: int = 30) -> list[dict]:
    daily = compute_daily_kpis(business_id)

    if daily.empty:
        return []

    daily["date"] = pd.to_datetime(daily["date"])

    # Show only recent history
    history_days = 30
    history = daily.tail(history_days).copy()

    series = []

    for _, row in history.iterrows():
        series.append({
            "date": row["date"].strftime("%Y-%m-%d"),
            "value": round(float(row["revenue"]), 2),
            "is_forecast": False,
            "confidence": None,
        })

    values = history["revenue"].to_numpy(dtype=float)

    if len(values) < 2:
        return series

    x = np.arange(len(values))

    slope, intercept = np.polyfit(x, values, 1)

    window = min(7, len(values))
    weights = np.arange(1, window + 1)

    baseline = np.average(values[-window:], weights=weights)

    residuals = values - (slope * x + intercept)

    noise_std = np.std(residuals) if len(residuals) > 1 else 0

    last_date = history["date"].iloc[-1]

    for i in range(1, horizon_days + 1):

        trend = slope * (len(values) + i - 1) + intercept

        # Weekly seasonality
        seasonal = values[(i - 1) % window] * 0.15

        prediction = (
            0.65 * trend +
            0.35 * baseline +
            seasonal +
            np.random.normal(0, noise_std * 0.15)
        )

        prediction = max(0, prediction)

        confidence = max(
            0.45,
            0.98 - i * (0.5 / horizon_days)
        )

        series.append({
            "date": (last_date + pd.Timedelta(days=i)).strftime("%Y-%m-%d"),
            "value": round(float(prediction), 2),
            "is_forecast": True,
            "confidence": round(confidence, 2),
        })

    return series


def forecast_demand(
    business_id: str,
    product: str | None = None,
    horizon_days: int = 7,
) -> list[dict]:

    from app.db.supabase_client import fetch_rows

    rows = fetch_rows("sales", business_id)

    df = pd.DataFrame(rows)

    if df.empty:
        return []

    df["date"] = pd.to_datetime(df["date"])

    product_col = "product" if "product" in df.columns else "dish"

    if product:
        df = df[df[product_col] == product]

    daily_qty = (
        df.groupby(df["date"].dt.date)["quantity"]
        .sum()
        .reset_index()
    )

    daily_qty.columns = ["date", "quantity"]

    if daily_qty.empty:
        return []

    values = daily_qty["quantity"].to_numpy(dtype=float)

    window = min(7, len(values))

    weights = np.arange(1, window + 1)

    baseline = np.average(values[-window:], weights=weights)

    last_date = pd.to_datetime(daily_qty["date"].iloc[-1])

    forecast = []

    for i in range(1, horizon_days + 1):

        seasonal = values[(i - 1) % window] * 0.1

        forecast.append({
            "date": (last_date + pd.Timedelta(days=i)).strftime("%Y-%m-%d"),
            "value": round(float(baseline + seasonal), 2),
            "is_forecast": True,
            "confidence": round(max(0.5, 0.9 - i * 0.03), 2),
        })

    return forecast