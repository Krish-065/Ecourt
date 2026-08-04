from fastapi import APIRouter, HTTPException, Depends
from app.api.schemas import (
    AgentQueryRequest, AgentQueryResponse,
    ContractAnalysisRequest, FIRAnalysisRequest,
    JudgmentSimplifyRequest, DraftGenerateRequest
)
from app.core.security import sanitize_and_check_prompt
from app.agents.agent_factory import agent_factory
from app.services.analyzers import ContractAnalyzer, FIRAnalyzer, JudgmentSimplifier, AIDraftGenerator

router = APIRouter()

@router.post("/chat/agent", response_model=AgentQueryResponse)
async def query_legal_agent(request: AgentQueryRequest):
    # 1. Prompt Injection Protection Check
    is_safe, sanitized_or_error = sanitize_and_check_prompt(request.query)
    if not is_safe:
        raise HTTPException(status_code=400, detail=sanitized_or_error)

    # 2. Execute RAG & Agent Pipeline
    result = agent_factory.execute_agent_query(request.agent_type, sanitized_or_error)
    return result

@router.post("/analyze/contract")
async def analyze_contract(request: ContractAnalysisRequest):
    return ContractAnalyzer.analyze(request.contract_text)

@router.post("/analyze/fir")
async def analyze_fir(request: FIRAnalysisRequest):
    return FIRAnalyzer.analyze(request.fir_text)

@router.post("/simplify/judgment")
async def simplify_judgment(request: JudgmentSimplifyRequest):
    return JudgmentSimplifier.simplify(request.judgment_text)

@router.post("/generate/draft")
async def generate_draft(request: DraftGenerateRequest):
    return AIDraftGenerator.generate_draft(request.draft_type, request.details)
