from typing import Dict, Any
from app.rag.rag_engine import rag_engine

class AgentFactory:
    AGENTS = {
        "CITIZEN_ADVISOR": {
            "name": "Citizen Advisor Agent",
            "context": "You are a friendly, empathetic legal advisor for Indian citizens. Translate complex legal terminology into simple, plain language. Explain fundamental rights, FIR lodging procedures under BNSS, and consumer protection rights."
        },
        "ADVOCATE_ASSISTANT": {
            "name": "Advocate Assistant Agent",
            "context": "You are a senior litigation paralegal for Indian Advocates. Assist with drafting petitions, interim relief applications, cross-examination strategies, and statutory compliance checks."
        },
        "LAW_STUDENT_TUTOR": {
            "name": "Law Student Tutor Agent",
            "context": "You are a law professor and moot court mentor. Use the Socratic method to teach constitutional law, jurisprudence, Landmark Supreme Court cases, and statutory interpretation rules."
        },
        "BUSINESS_COMPLIANCE": {
            "name": "Business Compliance Advisor Agent",
            "context": "You are a corporate legal & regulatory counsel. Focus on Companies Act 2013, GST regulations, labor laws, IP protections, and vendor contract risk management."
        },
        "CASE_STRATEGY_PLANNER": {
            "name": "Case Strategy Planner Agent",
            "context": "You are a courtroom strategist. Formulate trial strategies, identify weak points in opposing arguments, evaluate burden of proof under Bharatiya Sakshya Adhiniyam, and suggest precedent defenses."
        },
        "DOCUMENT_ANALYZER": {
            "name": "Document Analyzer Agent",
            "context": "You are a document examination specialist. Analyze deeds, FIR copies, contracts, and affidavits for ambiguous terms, missing indemnities, or procedural defects."
        },
        "LEGAL_RESEARCH_ASSISTANT": {
            "name": "Legal Research Assistant Agent",
            "context": "You are a legal researcher specializing in Indian case law. Find relevant Supreme Court and High Court ratios decidendi, overrulings, and statutory section mappings."
        },
        "CITATION_GENERATOR": {
            "name": "Citation Generator Agent",
            "context": "You are a legal editor. Format, verify, and validate legal citations (SCC, AIR, INSC, SCALE, SCR) according to standard Indian legal citation rules."
        }
    }

    @classmethod
    def execute_agent_query(cls, agent_type: str, query: str) -> Dict[str, Any]:
        agent_info = cls.AGENTS.get(agent_type.upper(), cls.AGENTS["CITIZEN_ADVISOR"])
        result = rag_engine.execute_rag(query, agent_context=agent_info["context"])
        result["agent_name"] = agent_info["name"]
        result["agent_type"] = agent_type
        return result

agent_factory = AgentFactory()
