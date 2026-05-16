# Gym Cancellation Tracker

A tool that rates how difficult it is to cancel a gym membership in Dublin. It automatically discovers gyms, scrapes their websites, extracts cancellation policy details using AI, and presents everything in a searchable web app.

**136 gyms tracked across County Dublin.**

---

## How it works

The project has two parts: a data pipeline that runs once (or on demand) to collect gym data, and a frontend app that displays it.

```
Phase 0: Discover gyms  →  Phase 1: Scrape websites  →  Phase 2: AI extraction  →  Frontend
(OpenStreetMap + Google)     (crawl4ai)                   (Claude API)               (React)
```

---

## Data Pipeline (`_pipeline/`)

All pipeline scripts live in `_pipeline/`. They are not deployed — they run locally to produce `policies.json`, which the frontend consumes.

### Phase 0 — Discover gyms (`phase0_discover/`)

**Script:** `discover_gyms.py`  
**Output:** `gyms.csv`, `gyms_with_website.csv`, `gyms_without_website.csv`

Pulls every gym in County Dublin from two sources:
- **OpenStreetMap** via Overpass API (free, no key needed)
- **Google Places API** to fill gaps and enrich with website URLs, lat/lng, ratings

Merges and deduplicates both sources, then splits into gyms with and without websites.

**Requires:** `GOOGLE_PLACES_API_KEY` in `phase0_discover/.env`

---

### Phase 1 — Scrape websites (`phase1_scrape/`)

**Script:** `scrape_gyms.py`  
**Output:** `raw_text/{gym_slug}.txt` (one file per gym)

For each gym with a website, crawls the pages most likely to contain cancellation or membership info:
- Checks known paths (`/terms`, `/membership`, `/faq`, `/cancellation`, etc.)
- Follows relevant links found on homepages (anything matching keywords like "terms", "cancel", "contract")
- Combines all page text into a single file per gym

Uses **crawl4ai** (Playwright-based) for JavaScript-rendered pages.

---

### Phase 2 — AI extraction (`phase2_extract/`)

**Script:** `extract_policies.py`  
**Output:** `extracted/{gym_slug}.json` + `policies.json` (combined master file)

Sends each gym's raw text to **Claude** (Anthropic API) with a structured prompt. Claude extracts:

| Field | Description |
|---|---|
| `monthly_price` | Monthly membership cost (€) |
| `joining_fee` | One-off joining fee (€) |
| `contract_type` | rolling / fixed / unknown |
| `lock_in_months` | Minimum contract length |
| `notice_period_days` | Days notice required to cancel |
| `cancellation_method` | How to cancel (email / in-person / online / post) |
| `in_person_required` | Whether you must cancel in person |
| `auto_renewal` | Whether membership auto-renews |
| `freeze_allowed` | Whether you can pause membership |
| `cooling_off_period_days` | Statutory cooling-off window |
| `difficulty_score` | 0–10 (0 = easy, 10 = very hard to cancel) |
| `transparency_score` | 0–10 (how clearly policy info is presented) |
| `dark_pattern_flags` | List of dark patterns found |
| `plain_english_summary` | 3–5 bullet points in plain language |
| `data_confidence` | high / medium / low |

**Requires:** `ANTHROPIC_API_KEY` in `phase0_discover/.env`

---

### Image scripts

| Script | What it does |
|---|---|
| `scrape_og_images.py` | Fetches the `og:image` (or first `<img>`) from each gym's website |
| `fetch_places_photos.py` | Downloads up to 3 photos per gym from Google Places Photos API |

Photos are saved to `frontend/public/gym-images/` and referenced in `policies.json`.

---

## Frontend (`frontend/`)

Built with **React + Vite + Tailwind CSS v4**. Reads `src/policies.json` (the pipeline output, copied in) at build time — no backend needed, fully static.

### Features

- **Grid / List / Map** views with animated tab switching
- **Search** by gym name
- **Sort** by hardest or easiest to cancel
- **Difficulty badges** — Easy (0–3) / Moderate (4–6) / Hard (7–10)
- **Gym drawer** — slides in from the right with full policy details, summary, dark pattern flags, and an info table
- **Map view** — Mapbox GL with colour-coded markers and hover tooltips
- Sticky controls bar with scroll-aware separator

### Setup

```bash
cd frontend
cp .env.example .env
# Add your Mapbox token to .env:
# VITE_MAPBOX_TOKEN=pk.eyJ1...

npm install
npm run dev
```

### Build for production

```bash
npm run build
# Output in frontend/dist/ — deploy as a static site
```

---

## Project structure

```
gym-cancel/
├── frontend/               # The deployable web app
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── components/
│   │   │   ├── GymCard.jsx
│   │   │   ├── GymDrawer.jsx
│   │   │   ├── GymMap.jsx
│   │   │   ├── DifficultyBadge.jsx
│   │   │   └── Squircle.jsx
│   │   └── policies.json   # Pipeline output consumed by the app
│   ├── public/
│   │   └── gym-images/     # Downloaded gym photos
│   ├── .env                # Local secrets (gitignored)
│   └── .env.example        # Template — copy to .env and fill in token
│
└── _pipeline/              # Data collection scripts (not deployed)
    ├── phase0_discover/    # Gym discovery (OSM + Google Places)
    ├── phase1_scrape/      # Website scraper (crawl4ai)
    ├── phase2_extract/     # AI policy extraction (Claude)
    ├── scrape_og_images.py # Fetch og:image from gym websites
    ├── fetch_places_photos.py  # Fetch Google Places photos
    ├── extracted/          # Per-gym JSON files (pipeline intermediate)
    ├── raw_text/           # Per-gym scraped text (pipeline intermediate)
    └── policies.json       # Master data file (copy to frontend/src/)
```

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Map | Mapbox GL JS |
| Gym discovery | OpenStreetMap (Overpass API), Google Places API |
| Web scraping | crawl4ai (Playwright) |
| AI extraction | Anthropic Claude API |
| Image fetching | Google Places Photos API |

---

## Re-running the pipeline

If you want to update the data (e.g. add new gyms or re-scrape):

```bash
cd _pipeline
python3 -m venv ../venv && source ../venv/bin/activate
pip install -r phase0_discover/requirements.txt

# 1. Discover
python3 phase0_discover/discover_gyms.py

# 2. Scrape
python3 phase1_scrape/scrape_gyms.py

# 3. Extract
python3 phase2_extract/extract_policies.py

# 4. Fetch images (optional)
python3 scrape_og_images.py
GOOGLE_API_KEY=your_key python3 fetch_places_photos.py

# 5. Copy output to frontend
cp policies.json ../frontend/src/policies.json
```
