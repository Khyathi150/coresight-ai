import json
from app.config.loader import IndustryConfig

SYSTEM_TEMPLATE = """
You are CoreSight, an AI business analyst.

{industry_context}

Rules:

- Use ONLY the supplied facts.
- Never invent numbers.
- Keep the response below 120 words.
- Give concise business insights.
- Finish with exactly 3 Recommended Actions.
"""

USER_TEMPLATE = """
Question:
{question}

Business Facts:

{facts}
"""


def summarize_facts(facts: dict) -> str:
    lines = []

    if "latest_kpis" in facts:
        latest = facts["latest_kpis"][-1]
        lines.append(
            f"Latest Revenue: {latest.get('revenue')}, "
            f"Profit: {latest.get('profit')}, "
            f"Orders: {latest.get('orders')}"
        )

    if "alerts" in facts:
        lines.append(f"Active Alerts: {len(facts['alerts'])}")

    if "top_products" in facts:
        names = [
            p.get("product") or p.get("dish")
            for p in facts["top_products"][:5]
        ]
        lines.append("Top Products: " + ", ".join(filter(None, names)))

    if "inventory_health" in facts:
        lines.append("Inventory data available.")

    if "revenue_forecast" in facts and facts["revenue_forecast"]:
        future = facts["revenue_forecast"][-1]
        lines.append(
            f"Forecast Revenue: {future.get('value')}"
        )

    return "\n".join(lines)


def build_messages(question: str, facts: dict, config: IndustryConfig):
    system = SYSTEM_TEMPLATE.format(
        industry_context=config.copilot_context
    )

    user = USER_TEMPLATE.format(
        question=question,
        facts=summarize_facts(facts)
    )

    return [
        {
            "role": "system",
            "content": system,
        },
        {
            "role": "user",
            "content": user,
        },
    ]