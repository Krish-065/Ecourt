# eCourt — AI Legal Operating System for India ⚖️🇮🇳

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)](https://tailwindcss.com/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20Express-green)](https://nodejs.org/)
[![AI Service](https://img.shields.io/badge/AI%20Microservice-FastAPI%20Python%203.11-teal)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2016%20%2B%20pgvector-336791)](https://www.postgresql.org/)
[![Security](https://img.shields.io/badge/Security-AES--256--GCM-darkred)](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)

**eCourt** is a high-performance, production-ready AI Legal Operating System engineered specifically for the Indian judicial jurisdiction. Grounded directly in the **Constitution of India**, **Bharatiya Nyaya Sanhita (BNS 2023)**, **Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)**, and **Bharatiya Sakshya Adhiniyam (BSA 2023)**, it unites live national court docket tracking, statutory RAG search, cryptographic client evidence vaults, and specialized AI workspaces.

---

## 🏛️ Key Features & Modules

### 1. 🔍 Live eCourts Docket & CNR Tracking
- **16-Digit CNR Query**: Live lookup across 3,000+ District and High Courts in India.
- **Cause List & Hearing Tracker**: Tracks presiding bench, interim court orders, and next hearing dates with automatic daily sync.
- **Portfolio Management**: One-click docket import into active litigation portfolios.
- **Evidence Timeline**: Chronological tamper-evident incident log with SHA-256 cryptographic verification.

### 2. 🤖 Zero-Hallucination Statutory RAG & AI Counsel
- **Anti-Hallucination Guarantee**: All answers tethered directly to active Bare Act provisions and reported Supreme Court ratio decidendi.
- **New Criminal Laws 2023**: Ingested BNS, BNSS, and BSA with automatic IPC/CrPC concordance cross-mapping.
- **Role-Specialized Legal Agents**:
  - **Citizen Legal Advisor**: Explains police powers, consumer disputes, and legal rights in plain speak.
  - **Advocate Co-Counsel**: Drafts writ petitions, bail applications, and cross-examination strategies.
  - **Moot & Jurisprudence Tutor**: Case law analysis, constitutional ratio, and moot court counter-arguments.
  - **Corporate Compliance Counsel**: Contract liability audit, DPDP Act 2023 compliance, and GST risk assessment.

### 3. 🔐 Client-Attorney Privilege Evidence Vault
- **AES-256-GCM Encryption**: Documents (deeds, FIRs, witness statements) are encrypted client-side before transmission.
- **Zero-Knowledge Architecture**: Encryption keys remain with the authorized chamber; platform operators cannot inspect privileged files.
- **Tamper-Evident Evidence Log**: Verifiable SHA-256 hashing for court evidence submission.

### 4. 📄 Statutory Document & Risk Diagnostics
- **Commercial Contract Risk Scanner**: Evaluates agreements for uncapped indemnification, non-compete enforceability (Section 27 Contract Act), and arbitration validity.
- **FIR & Police Notice Classifier**: Maps alleged offenses to BNS sections, determines bailability, and lists mandatory procedural rights under BNSS.

### 5. 👥 Bar-Certified Advocate Directory
- Search licensed advocates verified against State Bar Council Sanad registries.
- Filter by practice area (Criminal, Civil, Corporate, Constitutional Writs) and jurisdiction.
- Advocate profile portal for listing chamber experience, court enrollments, and helpline details.

---

## 🎭 Role-Based Feature Matrix

| Feature | Citizen | Advocate | Law Student | Corporate Counsel |
|---|---|---|---|---|
| **Chamber Dashboard** | Simplified Legal Rights | Litigation Dockets & Hearings | Study Desk & Moot Prep | Governance & Compliance HQ |
| **AI Counsel** | Citizen Plain-Speak Advisor | Petition & Bail Co-Counsel | Jurisprudence & Case Tutor | Corporate Regulatory Counsel |
| **Case Records** | Track Personal CNR Status | Full Portfolio + eCourts Grid | Landmark SC Precedents | Corporate Dispute Dockets |
| **Evidence Vault** | Personal Deeds & Records | Full Evidence Vault (AES-256) | Moot Memorial Vault | Master Service Agreements |
| **Statute Research** | Plain Rights Retrieval | Full BNS/BNSS/BSA Search | Constitutional & ILI Citations| Regulatory & Tax Search |
| **Diagnostic Scanners** | FIR & Police Notice Review | Contract & FIR Full Audit | Case Law Analysis | Commercial Due Diligence |
| **Advocate Directory** | Search & Retain Counsel | Manage Bar Profile | Mentorship Search | Retain Legal Panel |

---

## 🛠️ Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 14 Frontend Web App                 │
│  TypeScript • TailwindCSS • Plus Jakarta Sans • Lucide UI   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST
┌──────────────────────────────▼──────────────────────────────┐
│                  Node.js / Express API                      │
│     Clean Architecture • RBAC • JWT • AES-256 Storage       │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼───────────────┐
│     PostgreSQL 16 + pgvector ││   Python 3.11 AI Microservice│
│   Case Dockets & User Vaults││  FastAPI • Sentence-Xformers │
└─────────────────────────────┘└──────────────────────────────┘
```

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Plus Jakarta Sans
- **Backend**: Node.js, Express, TypeScript, JWT, Multer
- **AI Microservice**: Python 3.11, FastAPI, Sentence-Transformers, PyMuPDF
- **Database**: PostgreSQL 16 with `pgvector`
- **Cache & Message Broker**: Redis 7
- **Security**: AES-256-GCM encryption, Helmet.js, CORS, input sanitization

---

## 📂 Repository Directory Layout

```
ecourt/
├── frontend/                  # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/               # App Router pages (Dashboard, Cases, Vault, Research, etc.)
│   │   ├── components/        # Reusable UI components (Logo, Navbar, Sidebar, AgentCard)
│   │   └── lib/               # API clients and TypeScript interfaces
│   ├── public/                # Static assets & emblems
│   ├── tailwind.config.js     # Design system tokens & legal palette
│   └── next.config.js         # Production bundle optimizations
├── backend/                   # Node.js Express Backend Service
│   ├── src/                   # Controllers, routes, middleware, and database models
│   └── package.json
├── ai-service/                # Python FastAPI RAG & Semantic Retrieval Engine
│   ├── app/                   # Agents, embeddings, and Bare Act indices
│   └── requirements.txt
├── database/                  # PostgreSQL migrations, schema, and seed data
├── datasets/                  # Ingested Indian Bare Acts & Landmark Judgments
├── docker/                    # Docker Compose & Nginx configuration
└── storage/                   # Encrypted document vault storage (local)
```

---

## 🚀 Quick Start Guide

### Option 1: Frontend Development Only (Standalone)

To run only the frontend application (with built-in API fallbacks):

```powershell
# 1. Navigate to the frontend directory
cd "f:\SGP project\frontend"

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the Next.js development server
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

To compile a production build:
```powershell
npm run build
npm run start
```

---

### Option 2: Running Backend & AI Microservices Locally

#### 1. Backend Service (Port 5000)
```powershell
cd "f:\SGP project\backend"
npm install
npm run dev
```

#### 2. AI Microservice (Port 8000)
```powershell
cd "f:\SGP project\ai-service"
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

### Option 3: Full Stack with Docker Compose

To launch the complete infrastructure (PostgreSQL, Redis, AI Service, Backend, and Frontend):

```bash
docker-compose -f docker/docker-compose.yml up --build -d
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000`
- **AI Microservice Swagger Docs**: `http://localhost:8000/docs`

---

## 🔒 Security & Privacy Guarantees

- **Statutory Grounding**: The RAG pipeline relies exclusively on verified Indian statutes and authoritative court reporters (SCC / AIR / INSC).
- **Client Privilege**: Uploaded evidence files are encrypted using unique AES-256 session keys before writing to disk.
- **DPDP Act 2023 Aligned**: Consent notices, purpose limitation, and user record deletion mechanisms adhere to Indian data privacy rules.

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.
