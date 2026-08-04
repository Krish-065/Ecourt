-- ===================================================
-- ECourt Legal Operating System - Vector Store Schema
-- pgvector Extension & Indian Legal Corpus Vector Table
-- ===================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- Legal Knowledge Embeddings Table
CREATE TABLE IF NOT EXISTS legal_vector_store (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    corpus_type VARCHAR(100) NOT NULL, -- BARE_ACT, JUDGMENT, CONSTITUTION, GAZETTE
    act_or_court_name VARCHAR(255) NOT NULL, -- e.g. "Bharatiya Nyaya Sanhita 2023", "Supreme Court of India"
    section_or_case_ref VARCHAR(255) NOT NULL, -- e.g. "Section 103", "AIR 2023 SC 1450"
    content TEXT NOT NULL,
    chunk_index INT NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb, -- Includes section_title, keywords, landmark_tag, year
    embedding vector(384), -- 384 dimensions for all-MiniLM-L6-v2 (or 1536 for OpenAI text-embedding-3-small)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for Fast Cosine Similarity Vector Search
CREATE INDEX IF NOT EXISTS idx_legal_vector_embedding ON legal_vector_store 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Text Search Index for Hybrid RAG Search
CREATE INDEX IF NOT EXISTS idx_legal_vector_content_fts ON legal_vector_store 
USING gin (to_tsvector('english', content));

CREATE INDEX IF NOT EXISTS idx_legal_vector_corpus ON legal_vector_store (corpus_type);
