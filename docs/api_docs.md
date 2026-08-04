# ECourt AI Legal OS - API Documentation v1.0

## Base URLs
- **Backend API Gateway**: `http://localhost:5000/api/v1`
- **FastAPI AI Service**: `http://localhost:8000/api/v1`

---

## 1. Authentication & User Verification

### `POST /auth/register`
Registers a user with one of 5 legal roles (`CITIZEN`, `ADVOCATE`, `LAW_STUDENT`, `BUSINESS`, `ADMIN`).
- **Body**:
  ```json
  {
    "fullName": "Adv. Rajesh Sharma",
    "email": "advocate@ecourt.in",
    "password": "Password123!",
    "role": "ADVOCATE",
    "barCouncilId": "MAH/1234/2015"
  }
  ```

### `POST /auth/login`
Returns JWT access token, refresh token, and user verification profile.

---

## 2. Case Management & Evidence Timeline

### `POST /cases`
Creates a new case filing. Requires `Bearer <JWT>` header.

### `GET /cases/:id`
Returns case details, upcoming court hearing dates, evidence timeline entries, and associated encrypted vault documents.

### `POST /cases/:id/evidence`
Attaches an evidence timeline entry with cryptographic file hash check.

---

## 3. Encrypted Document Vault (AES-256-GCM)

### `POST /documents/upload`
Uploads file buffer, encrypts using AES-256-GCM, and stores securely.

### `GET /documents/:id/download`
Decrypts stored buffer on the fly and streams file back to authorized client.

---

## 4. AI Legal Agents & RAG Services (Python FastAPI)

### `POST /chat/agent`
Queries one of the 8 specialized AI Legal Agents:
- `CITIZEN_ADVISOR`
- `ADVOCATE_ASSISTANT`
- `LAW_STUDENT_TUTOR`
- `BUSINESS_COMPLIANCE`
- `CASE_STRATEGY_PLANNER`
- `DOCUMENT_ANALYZER`
- `LEGAL_RESEARCH_ASSISTANT`
- `CITATION_GENERATOR`

- **Request**:
  ```json
  {
    "agent_type": "ADVOCATE_ASSISTANT",
    "query": "Draft bail arguments under BNSS 483 for non-bailable offence."
  }
  ```
- **Response**:
  Returns RAG synthesis, mandatory statutory citations, and confidence score (0-100%). Prompt injection security filters automatically sanitize input.

### `POST /analyze/contract`
Scans contract text for uncapped indemnities, restraint of trade traps, and jurisdiction clauses.

### `POST /analyze/fir`
Parses FIR details, maps BNS / IPC sections, and determines bail eligibility and BNSS procedural rights.
