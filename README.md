<div align="center">
  <img src="frontend/public/logo-original.png" alt="Vietnam Digital Banking Intelligence Logo" width="560"/>
  <br/>
  <h1>Vietnam Digital Banking Intelligence</h1>
  <p><strong>Nền Tảng Trí Tuệ Dữ Liệu & Phân Tích Cảm Xúc Khía Cạnh (ABSA) Ngân Hàng Số Việt Nam</strong></p>
</div>

A market intelligence platform analyzing and comparing digital banking user experiences in Vietnam using real Google Play Store reviews, ratings, sentiment analysis, and aspect-based sentiment analysis (ABSA).

## Project Overview
* **Target Banks (7 Institutions):** `BIDV SmartBanking`, `Liobank`, `MB Bank`, `TNEX`, `TPBank Mobile`, `VCB Digibank`, `VietinBank iPay`.
* **Dataset Scope:** 19,303 unique reviews spanning July 2026 – November 2026.
* **Aspect-Based Sentiment Analysis (ABSA):** 13,864 sub-sentences from 8,666 long reviews evaluated across 7 business dimensions.
* **Cloud Infrastructure:** Google Cloud BigQuery (Project: `aiinbusinessgroup3`, Location: `asia-southeast1`).
* **Architecture:** Decoupled architecture with Next.js 15 (Frontend) and Python FastAPI (Backend).
* **Guiding Principle:** **Strict Zero Mock Data Policy**.

## Repository Structure
```
Project_AI_In_Biz/
├── backend/                  # Python FastAPI Backend (Milestone 1)
│   ├── app/                  # Application code
│   ├── tests/                # Automated BigQuery integration tests
│   ├── .env.example          # Environment template
│   └── README.md             # Backend setup & run guide
├── frontend/                 # Next.js 15 Frontend (Upcoming Milestone 3)
└── README.md
```

## Milestone Status
* **Milestone 1 (Current):** Backend Foundation & BigQuery Service ✅
* **Milestone 2 (Upcoming):** Backend API Endpoints (All 5 Modules)
* **Milestone 3 (Upcoming):** Next.js Frontend Shell & Client Setup
* **Milestone 4 (Upcoming):** Modules 1–3 UI (Market, Bank, Benchmark)
* **Milestone 5 (Upcoming):** Modules 4–5 UI (Explorer, Reports & Export)
* **Milestone 6 (Upcoming):** Zero Mock Audit & Final Handover
