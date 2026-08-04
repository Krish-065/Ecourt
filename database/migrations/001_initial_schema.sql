-- ===================================================
-- ECourt Legal Operating System - Database Schema v1.0
-- Jurisdiction: India (BNS, BNSS, BSA, Constitution, SC/HC)
-- ===================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Roles Enum
CREATE TYPE user_role AS ENUM (
    'CITIZEN',
    'ADVOCATE',
    'LAW_STUDENT',
    'BUSINESS',
    'ADMIN'
);

-- Verification Status Enum
CREATE TYPE verification_status AS ENUM (
    'PENDING',
    'VERIFIED',
    'REJECTED'
);

-- Case Status Enum
CREATE TYPE case_status AS ENUM (
    'DRAFT',
    'FILED',
    'PENDING_HEARING',
    'UNDER_TRIAL',
    'JUDGMENT_RESERVED',
    'DISPOSED',
    'APPEALED'
);

-- Case Priority Enum
CREATE TYPE case_priority AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CITIZEN',
    phone_number VARCHAR(20),
    verification_status verification_status DEFAULT 'VERIFIED', -- Citizens default VERIFIED, Advocates/Students require verification
    bar_council_id VARCHAR(100), -- Advocate verification
    college_id VARCHAR(100),     -- Student verification
    company_registration_no VARCHAR(100), -- Business verification
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Refresh Tokens Table (Auth)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verification Submissions Table
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- e.g. BAR_COUNCIL_CARD, COLLEGE_ID_CARD, COMPANY_CIN
    document_url VARCHAR(500) NOT NULL,
    status verification_status DEFAULT 'PENDING',
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cases Table
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    court_name VARCHAR(255) NOT NULL,
    statute_section VARCHAR(255), -- e.g. BNS Section 103 / IPC Section 302
    status case_status DEFAULT 'DRAFT',
    priority case_priority DEFAULT 'MEDIUM',
    client_id UUID NOT NULL REFERENCES users(id),
    advocate_id UUID REFERENCES users(id),
    filing_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Court Hearings Table
CREATE TABLE IF NOT EXISTS hearings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    hearing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    purpose TEXT NOT NULL,
    judge_name VARCHAR(255),
    outcome_notes TEXT,
    next_steps TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Evidence Timeline & Attachments Table
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    evidence_type VARCHAR(100) NOT NULL, -- DOCUMENT, PHYSICAL, DIGITAL, TESTIMONY
    source_origin VARCHAR(255),
    incident_date TIMESTAMP WITH TIME ZONE,
    file_url VARCHAR(500),
    file_hash VARCHAR(255), -- Cryptographic integrity check
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Document Vault (Encrypted Files)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    is_encrypted BOOLEAN DEFAULT TRUE,
    encryption_algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Chat Sessions & History Table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_type VARCHAR(100) NOT NULL DEFAULT 'CITIZEN_ADVISOR',
    title VARCHAR(255) NOT NULL DEFAULT 'Legal Query Session',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- USER or ASSISTANT
    message_text TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    confidence_score NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table (Cybersecurity Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL, -- LOGIN, DOCUMENT_DOWNLOAD, CASE_UPDATE, PROMPT_INJECTION_TRIGGER
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Speed
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cases_client ON cases(client_id);
CREATE INDEX idx_cases_advocate ON cases(advocate_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_evidence_case ON evidence(case_id);
CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);

-- Advocate Directory Profiles Table
CREATE TABLE IF NOT EXISTS advocate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    office_location VARCHAR(255) NOT NULL,
    experience_years INT NOT NULL,
    contact_phone VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

