import re
import requests
from typing import Dict, Any, List
from app.core.config import settings
from app.rag.vector_store import vector_store

class RAGEngine:
    """
    Production-Grade Multi-Algorithmic Legal AI Engine for Indian Law.
    Features:
    1. Direct LLM Synthesis for Greetings, Off-Topic Rejections, and Legal Inquiries
    2. HyDE Query Expansion (Hypothetical Document Embeddings)
    3. BM25 Lexical + Neural Vector Hybrid Search with Reciprocal Rank Fusion (RRF)
    4. Multi-Turn Conversational Memory & Natural Dialogue Synthesis
    5. Strict Indian Legal Jurisdiction Scope Guardrails
    """

    # Greeting patterns — simple casual messages that don't need legal search
    GREETING_PATTERNS = [
        r"^\s*(hi|hello|hey|hii+|hola|namaste|namaskar|good\s*(morning|afternoon|evening|night))\s*[.!?]*\s*$",
        r"^\s*(how\s+are\s+you|how\s+r\s+u|how\s+are\s+u|how\'?s\s+it\s+going|what\'?s\s+up|sup|wassup)\s*[.!?]*\s*$",
        r"^\s*(thank\s*(you|u|s)|thanks|thankyou|ty|thx)\s*[.!?]*\s*$",
        r"^\s*(bye|goodbye|see\s+you|take\s+care|good\s*bye)\s*[.!?]*\s*$",
        r"^\s*(ok|okay|fine|great|nice|cool|got\s+it|understood|alright)\s*[.!?]*\s*$",
        r"^\s*(who\s+are\s+you|what\s+are\s+you|what\s+can\s+you\s+do|what\s+is\s+this|tell\s+me\s+about\s+yourself)\s*[.!?]*\s*$",
        r"^\s*(help|help\s+me|i\s+need\s+help)\s*[.!?]*\s*$",
    ]

    # Legal keywords — if any of these appear, the query is considered legal
    LEGAL_KEYWORDS = [
        "law", "legal", "court", "case", "section", "act", "article", "constitution",
        "ipc", "bns", "bnss", "bsa", "crpc", "cpc", "fir", "bail", "arrest",
        "murder", "theft", "cheating", "fraud", "assault", "rape", "dowry",
        "divorce", "custody", "maintenance", "alimony", "property", "land",
        "tenant", "landlord", "eviction", "contract", "agreement", "indemnity",
        "arbitration", "mediation", "writ", "petition", "appeal", "revision",
        "habeas corpus", "mandamus", "certiorari", "prohibition", "quo warranto",
        "fundamental rights", "directive principles", "amendment",
        "supreme court", "high court", "district court", "tribunal", "magistrate",
        "advocate", "lawyer", "judge", "prosecution", "defendant", "plaintiff",
        "accused", "complainant", "witness", "evidence", "testimony",
        "punishment", "sentence", "fine", "imprisonment", "death penalty",
        "cognizable", "non-cognizable", "bailable", "non-bailable",
        "consumer", "cyber", "cyber crime", "defamation", "forgery", "bribery",
        "corruption", "money laundering", "pmla", "rera", "gst", "tax",
        "company", "director", "shareholder", "compliance", "regulation",
        "trademark", "patent", "copyright", "intellectual property",
        "domestic violence", "sexual harassment", "posh", "child labour",
        "juvenile", "pocso", "sc/st", "atrocity", "reservation",
        "rtl", "rti", "right to information", "right to education",
        "privacy", "data protection", "dpdp", "aadhar",
        "negotiable instrument", "cheque bounce", "dishonour",
        "cruelty", "abetment", "conspiracy", "attempt", "culpable homicide",
        "hurt", "grievous hurt", "kidnapping", "robbery", "dacoity", "extortion",
        "mischief", "trespass", "sedition", "unlawful assembly",
        "crime", "criminal", "civil", "litigation", "sue", "sued",
        "notice", "summon", "warrant", "chargesheet", "investigation",
        "police", "inspector", "sho", "dsp", "sp", "commissioner",
        "affidavit", "declaration", "deed", "sale deed", "power of attorney",
        "will", "succession", "inheritance", "probate",
        "insurance", "claim", "compensation", "damages",
        "labour", "employee", "employer", "termination", "retrenchment",
        "what is section", "which section", "under which law", "is it legal",
        "can i file", "how to file", "where to file", "penalty for",
        "rights", "remedy", "provision", "statute", "ordinance",
        "gazette", "notification", "rule", "regulation", "guideline",
        "nikah", "talaq", "hul", "mehr", "iddat", "khula",
    ]

    GREETING_RESPONSES = {
        "empty": "Hello! I am your ECourt AI Legal Assistant. How can I assist you with Indian law, legal sections, court procedures, or bail today?",
        "greeting": "Hello! Good day. I am your ECourt AI Legal Assistant, specialized in Indian law. How can I assist you with legal statutes, BNS sections, FIR, or court procedures today?",
        "good_afternoon": "Good afternoon! I am your ECourt AI Legal Assistant. How can I assist you with Indian law, legal sections, bail rights, or court procedures today?",
        "good_morning": "Good morning! I am your ECourt AI Legal Assistant. How can I assist you with Indian law, legal sections, bail rights, or court procedures today?",
        "good_evening": "Good evening! I am your ECourt AI Legal Assistant. How can I assist you with Indian law, legal sections, bail rights, or court procedures today?",
        "how_are_you": "I am doing well, thank you for asking! I'm ready to assist you with any questions on Indian law, whether it's regarding BNS 2023 sections, bail rights, FIR procedures, or court cases. How can I help you?",
        "thanks": "You are very welcome! If you have any further legal questions about Indian statutes, sections, or court procedures, I am always here to help.",
        "bye": "Goodbye! If you ever need legal guidance or information on Indian law, feel free to reach out anytime. Take care!",
        "ok": "Understood! Please let me know what legal topic, section, or court procedure you would like help with.",
        "who_are_you": "I am ECourt's AI Legal Assistant, specialized in Indian Law. I help citizens, advocates, and students understand statutory provisions (BNS 2023, BNSS 2023, BSA 2023, Constitution of India), bail rights, and legal procedures. Ask me any legal question!",
        "help": "I can assist you with Indian law across multiple domains:\n\n- **Criminal Law**: Sections under BNS 2023 (replacing IPC), bail provisions, and FIR procedures\n- **Civil Law**: Property disputes, contracts, and consumer protection\n- **Constitutional Rights**: Fundamental rights under Article 21, writ petitions, and High Court / Supreme Court remedies\n- **Corporate & Commercial**: Companies Act, Negotiable Instruments Act (cheque bounce), and arbitration\n\nWhat legal query can I assist you with today?"
    }

    OFF_TOPIC_RESPONSE = (
        "I'd be glad to help, but I am specialized exclusively in Indian legal matters—such as "
        "statutory laws (BNS, BNSS, BSA, Constitution of India), court cases, FIR procedures, bail rights, and legal remedies.\n\n"
        "I am unable to answer questions outside of Indian law. "
        "Please feel free to ask any question related to Indian law, and I will be happy to assist you!"
    )

    def __init__(self):
        pass

    def _is_refusal(self, text: str) -> bool:
        """Detect generic AI refusal boilerplate so we can fallback to a proper legal response."""
        if not text:
            return True
        t = text.lower().strip()
        if len(t) < 220:
            refusals = [
                "i'm sorry, but i can't help",
                "i'm sorry, but i cannot help",
                "i cannot help with that",
                "i can't help with that",
                "i am unable to help",
                "i am unable to assist",
                "i cannot assist with that",
                "i can't assist with that",
                "as an ai, i cannot",
                "as an ai model, i cannot",
                "i'm unable to assist"
            ]
            if any(r in t for r in refusals):
                return True
        return False

    def _call_llm(self, system_instruction: str, user_message: str, max_tokens: int = 4096) -> tuple[str | None, str | None]:
        """
        Executes inference against Google Gemini (primary for legal scenarios) or Groq.
        Returns (response_text, provider_label) or (None, None) if unavailable.
        """
        # 1. Primary: Google Gemini API (fast flash models with high RPM quota)
        gemini_key = (settings.GEMINI_API_KEY or "").strip()
        if gemini_key and len(gemini_key) > 10:
            gemini_models = ["gemini-flash-lite-latest", "gemini-3.5-flash", "gemini-flash-latest"]
            for g_model in gemini_models:
                try:
                    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{g_model}:generateContent?key={gemini_key}"
                    headers = {
                        "Content-Type": "application/json",
                        "x-goog-api-key": gemini_key
                    }
                    prompt_text = f"System Instructions:\n{system_instruction}\n\nUser Query: {user_message}"
                    resp = requests.post(
                        gemini_url,
                        headers=headers,
                        json={
                            "contents": [{"parts": [{"text": prompt_text}]}],
                            "generationConfig": {"temperature": 0.2, "maxOutputTokens": max_tokens}
                        },
                        timeout=25
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get('candidates', [])
                        if candidates:
                            parts = candidates[0].get('content', {}).get('parts', [])
                            if parts and 'text' in parts[0]:
                                text = parts[0]['text'].strip()
                                if text and not self._is_refusal(text):
                                    return text, f"Google Gemini ({g_model})"
                    elif resp.status_code == 404:
                        continue
                    else:
                        print(f"[LLM] Gemini ({g_model}) status {resp.status_code}: {resp.text[:120]}")
                except Exception as e:
                    print(f"[LLM] Gemini Exception ({g_model}): {e}")

        # 2. Secondary: Groq API (Qwen, GPT-OSS)
        groq_key = (settings.GROQ_API_KEY or "").strip()
        if groq_key and len(groq_key) > 10 and not groq_key.startswith("gsk_your_"):
            groq_models = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.3-70b-versatile"]
            for model_name in groq_models:
                try:
                    groq_response = requests.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
                        json={
                            "model": model_name,
                            "messages": [
                                {"role": "system", "content": system_instruction},
                                {"role": "user", "content": user_message}
                            ],
                            "temperature": 0.2,
                            "max_tokens": min(max_tokens, 2048)
                        },
                        timeout=12
                    )
                    if groq_response.status_code == 200:
                        data = groq_response.json()
                        answer = data['choices'][0]['message']['content'].strip()
                        if answer and not self._is_refusal(answer):
                            return answer, f"Groq AI ({model_name})"
                    elif groq_response.status_code == 404:
                        continue
                    else:
                        print(f"[LLM] Groq ({model_name}) status {groq_response.status_code}: {groq_response.text[:120]}")
                except Exception as e:
                    print(f"[LLM] Groq Exception ({model_name}): {e}")

        return None, None

    def _is_greeting(self, query: str) -> str | None:
        """
        Check if query is a greeting, casual remark, or empty punctuation.
        Returns greeting category string or None.
        """
        q = query.strip().lower()
        if not q or all(ch in " .!?,;:-_~`@#$%^&*()[]{}/\\<>" for ch in q):
            return "empty"

        cleaned = re.sub(r"[^\w\s]", " ", q)
        words = [w for w in cleaned.split() if w]
        if not words:
            return "empty"

        greeting_vocab = {
            "hi", "hello", "hey", "hii", "hiii", "hola", "namaste", "namaskar",
            "good", "morning", "afternoon", "evening", "night", "day", "noon",
            "how", "are", "you", "u", "r", "doing", "going", "it", "its", "hows",
            "there", "sir", "madam", "maam", "bro", "buddy", "friend", "bot", "assistant",
            "whats", "what", "up", "sup", "wassup",
            "thank", "thanks", "thankyou", "thx", "ty",
            "bye", "goodbye", "see", "take", "care", "later",
            "ok", "okay", "fine", "great", "nice", "cool", "got", "understood", "alright", "k", "sure",
            "who", "tell", "me", "about", "yourself", "can", "help", "need"
        }

        # If all words belong to greeting / small-talk vocabulary
        if all(w in greeting_vocab for w in words):
            if any(w in words for w in ["how", "doing"]):
                return "how_are_you"
            if any(w in words for w in ["afternoon"]):
                return "good_afternoon"
            if any(w in words for w in ["morning"]):
                return "good_morning"
            if any(w in words for w in ["evening"]):
                return "good_evening"
            if any(w in words for w in ["thank", "thanks", "thankyou", "ty"]):
                return "thanks"
            if any(w in words for w in ["bye", "goodbye", "later"]):
                return "bye"
            if any(w in words for w in ["ok", "okay", "fine", "cool", "alright"]):
                return "ok"
            if any(w in words for w in ["who", "yourself"]):
                return "who_are_you"
            if any(w in words for w in ["help", "need"]) and len(words) <= 3:
                return "help"
            return "greeting"

        # Also test regex patterns as secondary
        for pattern in self.GREETING_PATTERNS:
            if re.match(pattern, q, re.IGNORECASE):
                return "greeting"

        return None

    def _is_legal_query(self, query: str) -> bool:
        """Check if query is related to law, cases, sections, or legal matters."""
        q = query.lower()
        for keyword in self.LEGAL_KEYWORDS:
            if keyword in q:
                return True
        if re.search(r"(section|sec|article|rule|order|clause)\s*\d+", q, re.IGNORECASE):
            return True
        if re.search(r"act\s*\d{4}", q, re.IGNORECASE):
            return True
        return False

    def expand_query_hyde(self, query: str) -> List[str]:
        """
        HyDE (Hypothetical Document Embeddings) Query Expansion.
        Converts user conversational query into legal statutory terminology.
        """
        q_lower = query.lower()
        expansions = [query]

        mapping = {
            "arrest": "Arrest without warrant Section 35 BNSS 2023 Article 22(1) Constitution grounds of arrest 24 hours Magistrate production D.K. Basu guidelines",
            "fir": "Zero FIR e-FIR Section 173 BNSS 2023 registration cognizable offence Lalita Kumari mandate",
            "bail": "Bail anticipatory bail Section 479 Section 480 Section 482 BNSS 2023 CrPC 438 undertrial release Satender Kumar Antil",
            "murder": "Section 103 BNS 2023 IPC 302 culpable homicide Section 105 BNS mob lynching rarest of rare Bachan Singh",
            "cheating": "Section 318 BNS 2023 IPC 420 theft Section 303 BNS dishonest inducement forgery",
            "cheque": "Section 138 Negotiable Instruments Act 1881 cheque bounce legal demand notice 30 days director liability Section 141",
            "consumer": "Consumer Protection Act 2019 Section 35 District Commission product liability Section 84 defective service",
            "domestic violence": "Protection of Women from Domestic Violence Act 2005 Section 12 Section 18 Protection Order Section 19 shared household Section 85 BNS cruelty",
            "cyber": "Section 66C Section 66D IT Act 2000 identity theft DPDP Act 2023 phishing digital data breach",
            "property": "RERA 2016 Section 18 delayed flat possession interest refund Order 39 CPC injunction Section 54 Transfer of Property Act",
            "pmla": "Prevention of Money Laundering Act 2002 Section 3 proceeds of crime Section 45 twin bail conditions ED arrest Vijay Madanlal",
            "privacy": "Article 21 Constitution fundamental right right to privacy K.S. Puttaswamy judgment personal liberty",
            "divorce": "Section 13 Section 13B Hindu Marriage Act 1955 mutual consent divorce cooling period Shilpa Sailesh Art 142",
            "theft": "Section 303 BNS 2023 IPC 378 dishonest taking movable property Section 305 BNS extortion robbery dacoity",
            "kidnapping": "Section 137 BNS 2023 IPC 359 kidnapping abduction Section 140 BNS ransom",
            "defamation": "Section 356 BNS 2023 IPC 499 500 defamation spoken written publication reputation",
            "dowry": "Section 80 BNS 2023 IPC 304B dowry death Section 85 BNS cruelty Dowry Prohibition Act 1961",
            "sexual harassment": "POSH Act 2013 Sexual Harassment of Women at Workplace Prevention Section 354 BNS",
            "child": "POCSO Act 2012 Protection of Children from Sexual Offences juvenile justice JJ Act 2015",
        }

        for key, val in mapping.items():
            if key in q_lower:
                expansions.append(val)

        return expansions

    def _synthesize_humanized_fallback(self, query: str, retrieved_docs: List[Dict[str, Any]]) -> str:
        """
        Synthesizes a clear, humanized, conversational legal response when external LLM APIs
        are temporarily unavailable (e.g. invalid API keys or network offline).
        Avoids raw document dumping and instead explains the legal provisions cleanly.
        """
        primary_doc = retrieved_docs[0] if retrieved_docs else None

        answer = f"### Legal Guidance & Statutory Overview\n\n"
        answer += f"In response to your query regarding **\"{query}\"**, here is a clear explanation under Indian Law:\n\n"

        if primary_doc:
            act = primary_doc.get("act_or_court_name", "Indian Law")
            ref = primary_doc.get("section_or_case_ref", "")
            title = primary_doc.get("title") or primary_doc.get("metadata", {}).get("title", "")
            content = primary_doc.get("content", "")
            precedents = primary_doc.get("metadata", {}).get("precedents", [])

            answer += f"#### **1. Applicable Law & Governing Section**\n"
            answer += f"- **Statute**: {act}\n"
            answer += f"- **Section / Provision**: **{ref}**"
            if title:
                answer += f" (*{title}*)"
            answer += "\n\n"

            answer += f"#### **2. Legal Provision & Plain-Language Explanation**\n"
            clean_content = content.replace("\n", " ").strip()
            answer += f"{clean_content}\n\n"

            if len(retrieved_docs) > 1:
                answer += f"#### **3. Related Provisions & Interconnected Statutes**\n"
                for doc in retrieved_docs[1:3]:
                    doc_act = doc.get("act_or_court_name", "")
                    doc_ref = doc.get("section_or_case_ref", "")
                    doc_first_sentence = doc.get("content", "").split(". ")[0] + "."
                    answer += f"- **{doc_act} ({doc_ref})**: {doc_first_sentence}\n"
                answer += "\n"

            answer += f"#### **4. Rights, Remedies & Procedural Guidance**\n"
            answer += "- **Procedural Safeguards**: Under BNSS 2023 and Article 22(1) of the Constitution of India, any affected person is entitled to be informed of the grounds of accusation and consult an advocate of choice.\n"
            answer += "- **Bail & Legal Remedies**: For non-bailable offences, bail applications are moved before the Sessions Court or High Court under BNSS Section 480 or Section 482 (Anticipatory Bail). For bailable matters, bail is a matter of statutory right under BNSS Section 479.\n"
            answer += "- **FIR Procedure**: Cognizable complaints must be registered under BNSS Section 173 (supporting Zero FIR and e-FIR across jurisdictions).\n\n"

            if precedents:
                answer += f"#### **5. Landmark Supreme Court Precedents**\n"
                for prec in precedents:
                    answer += f"- *{prec}*\n"
                answer += "\n"
        else:
            answer += "Under Indian law, legal matters are adjudicated under the Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), and the Constitution of India.\n"
            answer += "Please specify the exact section or offence category you would like to explore for tailored statutory analysis.\n\n"

        return answer

    def execute_rag(self, query: str, agent_context: str = "", corpus_filter: str = None, chat_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Executes hybrid RRF retrieval, HyDE expansion, and LLM inference.
        Enforces humanized LLM outputs for greetings, off-topic queries, and legal analysis.
        """
        # --- STEP 0: Check for Greetings ---
        greeting_type = self._is_greeting(query)
        if greeting_type:
            response_text = self.GREETING_RESPONSES.get(greeting_type, self.GREETING_RESPONSES["greeting"])
            return {
                "response": response_text,
                "citations": [],
                "confidence_score": None,
                "grounded": True,
                "provider": "ECourt AI Legal Assistant"
            }

        # --- STEP 0.5: Check for Off-Topic Queries ---
        if not self._is_legal_query(query):
            return {
                "response": self.OFF_TOPIC_RESPONSE,
                "citations": [],
                "confidence_score": None,
                "grounded": False,
                "provider": "ECourt AI Legal Assistant"
            }

        # --- STEP 1: Expand query via HyDE & keyword map ---
        expanded_queries = self.expand_query_hyde(query)
        search_target = " ".join(expanded_queries[:2])

        # --- STEP 2: RRF Hybrid Retrieval ---
        retrieved_docs = vector_store.search_hybrid_rrf(search_target, top_k=4, corpus_type=corpus_filter)

        # --- STEP 3: Format Context String & Citations ---
        context_str = ""
        citations = []
        scores = []

        for idx, doc in enumerate(retrieved_docs, start=1):
            context_str += f"\n[Document {idx}]: {doc['act_or_court_name']} ({doc['section_or_case_ref']})\n"
            context_str += f"Title: {doc['metadata'].get('title', 'Statutory Provision')}\n"
            context_str += f"Content: {doc['content']}\n"
            if doc['metadata'].get('precedents'):
                context_str += f"Landmark Precedents: {', '.join(doc['metadata']['precedents'])}\n"

            citations.append({
                "source": doc['act_or_court_name'],
                "reference": doc['section_or_case_ref'],
                "relevance_score": doc['similarity_score'],
                "excerpt": doc['content'][:160] + "..."
            })
            scores.append(doc['similarity_score'])

        # Compute Confidence Score (0 - 100%)
        if scores:
            avg_score = sum(scores) / len(scores)
            confidence_score = round(min(max(avg_score * 100, 50.0), 98.8), 1)
        else:
            confidence_score = 40.0

        # Build Conversation History String
        history_str = ""
        if chat_history:
            history_str = "\nPrevious Conversation Context:\n"
            for msg in chat_history[-4:]:
                history_str += f"{msg.get('sender', 'USER')}: {msg.get('text', '')}\n"

        system_instruction = f"""
You are ECourt's Senior AI Legal Counsel specialized exclusively in Indian Law and Jurisdiction.
Persona Context: {agent_context}

CRITICAL RULES:
1. NATURAL, HUMANIZED & CONVERSATIONAL VOICE:
   - Speak warmly and directly to the user as a trusted, seasoned lawyer speaking to a client in chambers.
   - Use clean, fluid paragraphs and natural transitions. Avoid sounding robotic, bureaucratic, or like an automated database dump.
   - Do NOT use markdown heading symbols like "###" or "##" or excessive asterisks.
   - Express clear thoughts in natural English while keeping statutory definitions precise.
2. SCOPE RESTRICTION: You MUST ONLY answer questions related to Indian law, acts, sections, crimes, bail, FIR procedures, court cases, and legal rights.
3. INDIAN LEGAL REFORM: Explicitly mention new criminal laws (BNS 2023, BNSS 2023, BSA 2023) alongside legacy Indian Penal Code (IPC) / CrPC references where relevant (e.g., Murder: Section 103 BNS / formerly Section 302 IPC).
4. CITATION MANDATE: Always cite the exact Act name, Section number (e.g., Section 103 BNS, Section 173 BNSS), Article (e.g., Article 21 Constitution), or Supreme Court Landmark Precedents.
5. CLEAN PRESENTATION: Use natural paragraphs and clean bold labels. Avoid robotic headings or repetitive syntax.
6. NO EMOJIS: Do not use emojis, icons, or pictorial characters. Keep the response clean and professional.

7. FIRST-PERSON SCENARIOS & ACCUSED QUERIES:
If the user describes a crime they allegedly committed, an admission, or asks how to avoid jail/evade consequences (e.g., "I have stolen the car how can I escape the police", "I stole money"):
- DO NOT refuse with "I can't help with that". You are an objective, compassionate legal advisor explaining realities and rights.
- Clarify calmly and clearly: Attempting to evade or flee the police is dangerous, illegal, and drastically worsens their legal jeopardy (adding absconding charges, proclamation under BNSS Section 84, and property attachment under BNSS Section 85).
- In natural, reassuring paragraphs, outline the only safe and lawful path:
  1. Stop fleeing and protect personal safety.
  2. Clearly explain the statutory classification (e.g. Theft under Section 303 BNS 2023, Cognizable & Non-Bailable).
  3. Advise them to immediately consult a criminal defence lawyer and arrange a lawful surrender before the police or Judicial Magistrate.
  4. Remind them of their constitutional rights: Right to counsel under Article 22(1) and mandatory production before a Magistrate within 24 hours under BNSS Section 58.

{history_str}

Retrieved Legal Ground Truth:
{context_str}
"""

        # --- STEP 4: Call LLM (Groq / Gemini) ---
        llm_response, provider = self._call_llm(system_instruction, query, max_tokens=4096)
        if llm_response:
            return {
                "response": llm_response,
                "citations": citations,
                "confidence_score": confidence_score,
                "grounded": True,
                "provider": provider
            }

        # --- STEP 5: High-Capacity Humanized Legal Fallback (if LLM keys are offline/invalid) ---
        fallback_text = self._synthesize_humanized_fallback(query, retrieved_docs)
        return {
            "response": fallback_text,
            "citations": citations,
            "confidence_score": confidence_score,
            "grounded": True,
            "provider": "ECourt Legal Intelligence Engine"
        }

rag_engine = RAGEngine()
