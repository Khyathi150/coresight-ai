# CoreSight AI

An AI-powered Business Operating System — dashboards, forecasting, anomaly
detection, and an AI copilot, built on a **config-driven core** that adapts
to any industry by swapping a YAML file, not the code.

Built entirely on free tiers: **Groq** (LLM), **Supabase** (Postgres + auth + storage),
**Vercel** (frontend hosting), **Render** (backend hosting).

![status](https://img.shields.io/badge/status-hackathon--MVP-E08D2C)
![stack](https://img.shields.io/badge/stack-FastAPI%20%2B%20React%20%2B%20Supabase%20%2B%20Groq-3FB8AF)

## The idea

Most BI tools show you numbers. CoreSight computes the numbers itself
(deterministically, in Python — no LLM guessing), then uses an LLM **only**
to explain what those numbers mean and what to do next. We call this
**compute-then-narrate**: the AI never invents a figure, because it never
sees raw data — only the facts your analytics engine already computed.

```
CSV upload → validate & clean → Supabase → KPI engine → forecasting engine
→ anomaly detection → [facts as JSON] → Groq narrates → dashboard / copilot / PDF report
```

## Why config-driven

Every industry — retail, restaurant, healthcare, whatever — is a YAML file
under `backend/app/config/industries/`. It declares required columns, KPIs,
alert thresholds, and the copilot's persona. The ingestion, KPI, forecasting,
and copilot code never branches on industry — it reads the active config.
See `retail.yaml` vs `restaurant.yaml` for the same architecture serving two
different businesses.

## Project structure

```
backend/    FastAPI app — ingestion, KPI engine, forecasting, anomaly
            detection, Groq copilot, PDF reports
frontend/   React + Vite + Tailwind dashboard, forecasts, copilot chat,
            reports, alerts
```

## Running it locally

### 1. Supabase (free tier)
1. Create a project at supabase.com.
2. Open the SQL editor, paste `backend/supabase/schema.sql`, run it.
3. Grab your project URL and `service_role` key from Settings → API.

### 2. Groq (free tier)
1. Get a key at console.groq.com.

### 3. Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in SUPABASE_URL, SUPABASE_KEY, GROQ_API_KEY
uvicorn app.main:app --reload --port 8000
```

### 4. Load sample data (optional, instant demo)
```bash
curl -X POST "http://localhost:8000/upload/00000000-0000-0000-0000-000000000001?dataset=sales" \
  -F "file=@data/sample_datasets/sales.csv"
curl -X POST "http://localhost:8000/upload/00000000-0000-0000-0000-000000000001?dataset=inventory" \
  -F "file=@data/sample_datasets/inventory.csv"
```

### 5. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # defaults already point at localhost:8000
npm run dev
```

Open `http://localhost:5173`.

## Adding a new industry

1. Copy `backend/app/config/industries/retail.yaml` to `<industry>.yaml`.
2. Change `required_columns`, `kpis`, `alert_rules`, `copilot_context`.
3. Set `ACTIVE_INDUSTRY=<industry>` in `backend/.env`.

Nothing else changes.

## Roadmap

- Multi-branch comparison view
- Customer segmentation (ML clustering)
- Nightly retraining loop (prediction vs actual → model refresh)
- Additional industry configs: healthcare, manufacturing, education
