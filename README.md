# ECourt - AI Legal Operating System for India ⚖️🇮🇳

**ECourt** is a startup-grade, production-ready AI Legal Operating System engineered for the Indian legal jurisdiction. It provides end-to-end legal intelligence, statutory RAG search, case management, document vault encryption, and specialized AI agents tailored for Citizens, Advocates, Law Students, Businesses, and Administrators.

---

## Technical Stack & Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn UI, Framer Motion
- **Backend API**: Node.js, Express, TypeScript (Clean Architecture, RBAC, JWT, AES-256)
- **AI Microservice**: Python 3.11, FastAPI, LangChain/LlamaIndex, Sentence-Transformers, PyMuPDF
- **Database**: PostgreSQL 16 with `pgvector` extension
- **Cache & Queue**: Redis 7
- **Storage**: S3-compatible (MinIO / AWS S3 client with AES-256 encryption)
- **Containerization & Gateway**: Docker, Docker Compose, Nginx Gateway

---

## Directory Structure

```
ecourt/
├── frontend/          # Next.js 14 Web Application
├── backend/           # Node.js Express Backend Service
├── ai-service/        # FastAPI Python AI & RAG Engine
├── database/          # PostgreSQL Migrations & Datasets
├── docker/            # Docker Compose & Nginx Configuration
├── docs/              # System Documentation & API Specs
├── scripts/           # Ingestion & Deployment Scripts
├── datasets/          # Ingested Indian Bare Acts & Judgments
├── storage/           # Local Document Vault Storage
└── tests/             # End-to-end and Integration Tests
```

---

## Quick Start (Docker)

```bash
cd ecourt
cp .env.example .env
docker-compose -f docker/docker-compose.yml up --build -d
```

Frontend UI: `http://localhost:3000`
Backend API: `http://localhost:5000`
AI Service Docs: `http://localhost:8000/docs`
