from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class AgentQueryRequest(BaseModel):
    agent_type: str = Field(default="CITIZEN_ADVISOR", description="One of: CITIZEN_ADVISOR, ADVOCATE_ASSISTANT, LAW_STUDENT_TUTOR, BUSINESS_COMPLIANCE, CASE_STRATEGY_PLANNER, DOCUMENT_ANALYZER, LEGAL_RESEARCH_ASSISTANT, CITATION_GENERATOR")
    query: str = Field(..., example="What are my rights if arrested without a warrant under BNSS?")

class CitationItem(BaseModel):
    source: str
    reference: str
    relevance_score: float
    excerpt: str

class AgentQueryResponse(BaseModel):
    response: str
    citations: List[CitationItem]
    confidence_score: float
    grounded: bool
    agent_name: str
    agent_type: str

class ContractAnalysisRequest(BaseModel):
    contract_text: str = Field(..., example="Party A agrees to indemnify Party B without limit for all damages...")

class FIRAnalysisRequest(BaseModel):
    fir_text: str = Field(..., example="FIR filed under Section 302 and 420 regarding land fraud in Delhi.")

class JudgmentSimplifyRequest(BaseModel):
    judgment_text: str = Field(..., example="The High Court held that natural justice principles apply to administrative actions...")

class DraftGenerateRequest(BaseModel):
    draft_type: str = Field(..., example="LEGAL_NOTICE")
    details: Dict[str, Any] = Field(..., example={"client_name": "Priya Verma", "opposite_party": "ABC Corp", "facts": "Unpaid invoice of Rs 5,00,000"})
