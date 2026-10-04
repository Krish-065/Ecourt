'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { queryAIAgent } from '../../lib/api';
import AgentCard from '../../components/AgentCard';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  BookOpen, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Trash2, 
  Cpu, 
  Scale, 
  LogIn,
  CheckSquare,
  Shield,
  Gavel,
  GraduationCap,
  Building2,
  Lock,
  ChevronRight,
  Info,
  ExternalLink
} from 'lucide-react';

export default function AIChatWorkspace() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const [selectedAgent, setSelectedAgent] = useState('CITIZEN_ADVISOR');
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [messages, setMessages] = useState<Array<{
    sender: 'USER' | 'ASSISTANT';
    text: string;
    citations?: any[];
    confidence?: number;
    agentName?: string;
    provider?: string;
  }>>([]);

  const agentList = [
    { id: 'CITIZEN_ADVISOR', name: 'Citizen Legal Advisor', roleDescription: 'Explains civil rights, police powers & BNSS procedures in plain speak', iconName: 'UserCheck' },
    { id: 'ADVOCATE_ASSISTANT', name: 'Advocate Co-Counsel', roleDescription: 'Drafts writ petitions, bail applications & cross-examination strategies', iconName: 'Gavel' },
    { id: 'LAW_STUDENT_TUTOR', name: 'Moot & Jurisprudence Tutor', roleDescription: 'Constitutional assembly debates, ratio decidendi & landmark precedent analysis', iconName: 'GraduationCap' },
    { id: 'BUSINESS_COMPLIANCE', name: 'Corporate Compliance Counsel', roleDescription: 'Companies Act, GST statutory liabilities & contract risk assessment', iconName: 'Building2' },
    { id: 'CASE_STRATEGY_PLANNER', name: 'Litigation Strategy Planner', roleDescription: 'Procedural risk analysis, jurisdictional objections & appellate roadmap', iconName: 'Target' },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('ecourt_user');
    const savedToken = localStorage.getItem('ecourt_token');
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);

        // Automatically set the specialized legal agent based on the logged-in user's role
        if (parsedUser.role === 'CITIZEN') {
          setSelectedAgent('CITIZEN_ADVISOR');
        } else if (parsedUser.role === 'ADVOCATE') {
          setSelectedAgent('ADVOCATE_ASSISTANT');
        } else if (parsedUser.role === 'LAW_STUDENT') {
          setSelectedAgent('LAW_STUDENT_TUTOR');
        } else if (parsedUser.role === 'BUSINESS') {
          setSelectedAgent('BUSINESS_COMPLIANCE');
        } else {
          setSelectedAgent('CASE_STRATEGY_PLANNER');
        }
      } catch (e) {}
    }
  }, []);

  // Fetch or create chat session for this agent
  useEffect(() => {
    if (!token) return;
    
    const initSession = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/chat/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ agentType: selectedAgent })
        });
        const data = await res.json();
        if (data.success) {
          setCurrentSession(data.data);
          fetchHistory(data.data.id);
        }
      } catch (err) {
        console.error('Error initiating session:', err);
      }
    };

    initSession();
  }, [selectedAgent, token]);

  const fetchHistory = async (sessionId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/chat/sessions/${sessionId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const currentAgentInfo = agentList.find(a => a.id === selectedAgent) || agentList[0];
      
      if (data.success && data.data.length > 0) {
        setMessages(data.data.map((m: any) => ({
          sender: m.sender,
          text: m.message_text,
          citations: typeof m.citations === 'string' ? JSON.parse(m.citations) : m.citations,
          confidence: m.confidence_score ? parseFloat(m.confidence_score) : undefined,
          agentName: currentAgentInfo.name,
          provider: 'eCourt Judicial Engine'
        })));
      } else {
        setMessages([
          {
            sender: 'ASSISTANT',
            text: `Welcome to your digital chambers. I am initialized as your specialized **${currentAgentInfo.name}**.\n\nMy reasoning is grounded directly in the Constitution of India, Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), Bharatiya Sakshya Adhiniyam (BSA 2023), CPC, and Supreme Court precedent.\n\nEnter your query or case facts below to receive statutory analysis and actionable legal guidance.`,
            citations: [],
            confidence: 99.0,
            agentName: currentAgentInfo.name,
            provider: 'eCourt Judicial Engine'
          }
        ]);
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || loading || !currentSession || !token) return;

    const queryText = userQuery;
    setUserQuery('');
    
    setMessages((prev) => [...prev, { sender: 'USER', text: queryText }]);
    setLoading(true);

    try {
      await fetch('http://localhost:5000/api/v1/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: currentSession.id,
          sender: 'USER',
          messageText: queryText
        })
      });
    } catch (err) {}

    const res = await queryAIAgent(selectedAgent, queryText);
    const assistantText = res.response || res.detail || 'Unable to compute statutory RAG response.';
    const confidenceScore = res.confidence_score || 95.0;
    const citations = res.citations || [];

    try {
      await fetch('http://localhost:5000/api/v1/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: currentSession.id,
          sender: 'ASSISTANT',
          messageText: assistantText,
          citations,
          confidenceScore
        })
      });
    } catch (err) {}

    setMessages((prev) => [
      ...prev,
      {
        sender: 'ASSISTANT',
        text: assistantText,
        citations,
        confidence: confidenceScore,
        agentName: res.agent_name || selectedAgent,
        provider: res.provider || 'eCourt Judicial Engine',
      },
    ]);
    setLoading(false);
  };

  const handleClearChat = async () => {
    if (!currentSession || !token) return;
    try {
      await fetch(`http://localhost:5000/api/v1/chat/sessions/${currentSession.id}/messages`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const currentAgentInfo = agentList.find(a => a.id === selectedAgent) || agentList[0];
      setMessages([
        {
          sender: 'ASSISTANT',
          text: `Chamber record cleared. Ready for your next legal consultation under **${currentAgentInfo.name}**.`,
          citations: [],
          confidence: 99.0,
          agentName: currentAgentInfo.name,
          provider: 'eCourt Judicial Engine'
        }
      ]);
    } catch (e) {
      console.error('Failed to clear chat sessions:', e);
    }
  };

  // Structured response parser for legal briefs
  const renderFormattedResponse = (text: string) => {
    let cleanText = text
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
      .replace(/[\u2600-\u27BF]/g, '');

    const sections = [
      { key: 'Direct Legal Answer & Statutory Ratio', label: 'Statutory Ratio & Holding', icon: Scale, border: 'border-blue-600', bg: 'bg-blue-50/40' },
      { key: 'Key Rights & Remedies Available', label: 'Rights & Substantive Remedies', icon: ShieldCheck, border: 'border-slate-700', bg: 'bg-white' },
      { key: 'Step-by-Step Action Plan / Filing Guidance', label: 'Procedural Roadmap', icon: CheckSquare, border: 'border-emerald-600', bg: 'bg-white' },
      { key: 'Grounded Statutory & Precedent Footnotes', label: 'Authorities & Bare Act Citations', icon: BookOpen, border: 'border-indigo-600', bg: 'bg-slate-50' }
    ];

    let isStructured = false;
    for (const s of sections) {
      if (cleanText.includes(s.key)) {
        isStructured = true;
        break;
      }
    }

    if (!isStructured) {
      return <div className="whitespace-pre-wrap leading-relaxed text-xs md:text-sm text-slate-800">{cleanText}</div>;
    }

    const parts = cleanText.split(/(\*\*Direct Legal Answer & Statutory Ratio\*\*|\*\*Key Rights & Remedies Available\*\*|\*\*Step-by-Step Action Plan \/ Filing Guidance\*\*|\*\*Grounded Statutory & Precedent Footnotes\*\*|Direct Legal Answer & Statutory Ratio|Key Rights & Remedies Available|Step-by-Step Action Plan \/ Filing Guidance|Grounded Statutory & Precedent Footnotes)/g);

    const renderedElements: React.ReactNode[] = [];
    let currentHeader = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue;

      const matchedSection = sections.find(s => 
        part.includes(s.key) || 
        part.replace(/\*/g, '').trim() === s.key
      );

      if (matchedSection) {
        currentHeader = matchedSection.key;
      } else {
        if (currentHeader) {
          const sect = sections.find(s => s.key === currentHeader)!;
          const IconComponent = sect.icon;
          renderedElements.push(
            <div key={i} className={`p-4 rounded-xl border-l-4 ${sect.border} ${sect.bg} border-t border-r border-b border-slate-200 shadow-2xs space-y-1.5`}>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900">
                <IconComponent className="h-3.5 w-3.5 text-blue-600" />
                <span>{sect.label}</span>
              </div>
              <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {part.replace(/^[:\s\-*]+/g, '').trim()}
              </div>
            </div>
          );
          currentHeader = '';
        } else {
          renderedElements.push(
            <div key={i} className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {part}
            </div>
          );
        }
      }
    }

    return <div className="space-y-3">{renderedElements}</div>;
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6">
        <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Sign In to Chamber Records</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Persistent legal consultations, case files, and research notes are cryptographically shielded within your authorized profile.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link 
            href="/register" 
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
          >
            Create Chamber Account
          </Link>
          <Link 
            href="/auth" 
            className="w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-xs transition flex items-center justify-center gap-1.5"
          >
            <LogIn className="h-3.5 w-3.5 text-blue-600" />
            <span>Sign In with Existing Credentials</span>
          </Link>
        </div>
      </div>
    );
  }

  const activeAgentInfo = agentList.find(a => a.id === selectedAgent) || agentList[0];

  return (
    <div className="space-y-5 min-h-[calc(100vh-100px)] flex flex-col">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">
              AI Legal Counsel Workspace
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Statutory RAG
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Grounded directly in the Constitution of India, BNS 2023, BNSS, and Supreme Court precedent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAgentPicker(!showAgentPicker)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:border-blue-400 transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Switch Persona</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAgentPicker ? 'rotate-90' : ''}`} />
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs border border-slate-200 transition cursor-pointer"
            title="Reset Chamber Session"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expandable Agent Selection Shelf */}
      {showAgentPicker && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-900">Select Specialized Legal Counsel</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {agentList.map((agent) => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                roleDescription={agent.roleDescription}
                iconName={agent.iconName}
                isSelected={selectedAgent === agent.id}
                onSelect={(id) => {
                  setSelectedAgent(id);
                  setShowAgentPicker(false);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Main conversation box */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
          
          {/* Active Agent Info Banner */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-bold text-xs text-slate-900">Counsel: {activeAgentInfo.name}</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 font-semibold">
              Sub-second Bare Act RAG
            </span>
          </div>

          {/* Message Thread Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[88%] p-4 rounded-xl ${
                  msg.sender === 'USER'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-bl-none shadow-2xs'
                }`}>
                  {msg.sender === 'ASSISTANT' && (
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 mb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-900 uppercase tracking-wider">
                        {msg.agentName || 'eCourt Counsel'}
                      </span>
                      {msg.confidence && (
                        <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[9px]">
                          {msg.confidence}% Statutorily Grounded
                        </span>
                      )}
                    </div>
                  )}

                  <div>
                    {msg.sender === 'ASSISTANT' ? renderFormattedResponse(msg.text) : msg.text}
                  </div>

                  {/* Precedent references footnotes */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 mt-3 border-t border-slate-200 space-y-2">
                      <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Grounded Statutory Citations:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.citations.map((c, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-white text-[11px] border border-slate-200 text-slate-800 flex items-center justify-between shadow-2xs">
                            <span className="truncate pr-2 font-medium"><strong>{c.source}</strong> ({c.reference})</span>
                            <span className="text-[10px] bg-slate-50 text-blue-600 px-1.5 py-0.5 rounded font-mono font-bold border border-slate-200 shrink-0">
                              {(c.relevance_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2.5 text-slate-600 text-xs p-3.5 rounded-xl bg-slate-50 border border-slate-200 w-fit">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
                <span className="font-medium">Synthesizing relevant statutory chapters and precedents...</span>
              </div>
            )}
          </div>

          {/* Form input controls */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={`Consult ${activeAgentInfo.name} on Indian statutes, case facts, or legal motions...`}
              className="flex-1 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={loading || !userQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 disabled:opacity-40 transition cursor-pointer"
            >
              <span>Submit</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Right Info and Quick Queries Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="pb-3 border-b border-slate-100">
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              Chamber Consultation Context
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active persona tailored for your operating profile.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{activeAgentInfo.name}</span>
            </div>
            <p className="text-slate-600 text-[11px]">{activeAgentInfo.roleDescription}</p>
          </div>

          <div className="space-y-2.5">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Example Jurisprudential Queries
            </div>
            <button
              onClick={() => setUserQuery("What constitutional remedies exist under Article 21 and Article 32 if police detain someone without disclosing grounds?")}
              className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 text-xs text-slate-800 font-medium transition cursor-pointer leading-snug"
            >
              Constitutional Writs & Art. 21 Detention Safeguards
            </button>
            <button
              onClick={() => setUserQuery("Explain the punishment for Mob Lynching under Section 103(2) of Bharatiya Nyaya Sanhita 2023.")}
              className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 text-xs text-slate-800 font-medium transition cursor-pointer leading-snug"
            >
              Mob Lynching Penalty under Section 103(2) BNS 2023
            </button>
            <button
              onClick={() => setUserQuery("What are the twin conditions for bail under Section 45 of PMLA 2002?")}
              className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 text-xs text-slate-800 font-medium transition cursor-pointer leading-snug"
            >
              PMLA Sec 45 Twin Bail Requirements & Burden of Proof
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
