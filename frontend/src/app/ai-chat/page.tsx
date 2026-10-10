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
    { id: 'LAW_STUDENT_TUTOR', name: 'Jurisprudence & Precedent Tutor', roleDescription: 'Constitutional assembly debates, ratio decidendi & landmark precedent analysis', iconName: 'GraduationCap' },
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
    const citations = res.citations || [];
    const confidenceScore = (citations.length > 0 && res.confidence_score) ? res.confidence_score : undefined;

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

    const currentAgentInfo = agentList.find(a => a.id === selectedAgent) || agentList[0];
    setMessages((prev) => [
      ...prev,
      {
        sender: 'ASSISTANT',
        text: assistantText,
        citations,
        confidence: confidenceScore,
        agentName: currentAgentInfo.name,
        provider: 'eCourt Judicial Engine'
      }
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

  // Inline text formatter for **bold**, *italic*, and `code`
  const formatInlineText = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={index} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return (
          <em key={index} className="italic text-slate-800 dark:text-slate-200">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code key={index} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-[11px] border border-slate-200/80 dark:border-slate-700/60">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderBlockText = (content: string): React.ReactNode => {
    const blocks = content.split(/\n\s*\n/);

    return blocks.map((block, bIdx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (/^#{1,4}\s+/.test(trimmed)) {
        const headingTitle = trimmed.replace(/^#{1,4}\s+/, '').replace(/\*\*/g, '').trim();
        return (
          <div key={bIdx} className="pt-2 pb-1 border-b border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-600 dark:bg-blue-400 rounded-full inline-block" />
            <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white tracking-tight">
              {headingTitle}
            </h4>
          </div>
        );
      }

      const lines = trimmed.split('\n');
      const isList = lines.every(l => !l.trim() || /^(\s*[-*•]|\s*\d+[\.\)])\s+/.test(l));

      if (isList) {
        return (
          <ul key={bIdx} className="space-y-1.5 pl-1 my-1">
            {lines.map((line, lIdx) => {
              const lTrim = line.trim();
              if (!lTrim) return null;
              const cleanLine = lTrim.replace(/^([-*•]|\d+[\.\)])\s+/, '');
              return (
                <li key={lIdx} className="flex items-start gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xs mt-0.5">•</span>
                  <span className="flex-1">{formatInlineText(cleanLine)}</span>
                </li>
              );
            })}
          </ul>
        );
      }

      return (
        <p key={bIdx} className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {lines.map((line, lIdx) => {
            const lTrim = line.trim();
            if (/^([-*•]|\d+[\.\)])\s+/.test(lTrim)) {
              const cleanItem = lTrim.replace(/^([-*•]|\d+[\.\)])\s+/, '');
              return (
                <span key={lIdx} className="flex items-start gap-2 my-1 pl-1">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xs mt-0.5">•</span>
                  <span className="flex-1">{formatInlineText(cleanItem)}</span>
                </span>
              );
            }
            return (
              <React.Fragment key={lIdx}>
                {formatInlineText(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            );
          })}
        </p>
      );
    });
  };

  const renderFormattedResponse = (text: string) => {
    let cleanText = (text || '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
      .replace(/[\u2600-\u27BF]/g, '');

    return (
      <div className="space-y-2.5 text-xs md:text-sm leading-relaxed">
        {renderBlockText(cleanText)}
      </div>
    );
  };

  const activeAgentInfo = agentList.find(a => a.id === selectedAgent) || agentList[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            AI Co-Counsel & Advisory Chambers
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Role-grounded statutory RAG engine with zero hallucinations and direct Bare Act concordance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-slate-900 dark:text-white font-bold">{activeAgentInfo.name}</span>
          </div>
          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-xs border border-slate-200/80 dark:border-slate-700/60 transition cursor-pointer shadow-xs"
            title="Reset Chamber Session"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Main conversation box */}
        <div className="lg:col-span-2 bg-white/85 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl flex flex-col h-[600px] overflow-hidden">
          
          {/* Active Agent Info Banner */}
          <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-bold text-xs text-slate-900 dark:text-white">Counsel: {activeAgentInfo.name}</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              Sub-second Bare Act RAG
            </span>
          </div>

          {/* Message Thread Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[88%] p-4 rounded-2xl ${
                  msg.sender === 'USER'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/20'
                    : 'bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 rounded-bl-none shadow-xs'
                }`}>
                  {msg.sender === 'ASSISTANT' && (
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-700/60">
                      <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {msg.agentName || 'eCourt Counsel'}
                      </span>
                    </div>
                  )}

                  <div>
                    {msg.sender === 'ASSISTANT' ? renderFormattedResponse(msg.text) : msg.text}
                  </div>

                  {/* Precedent references footnotes */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 mt-3 border-t border-slate-200/80 dark:border-slate-700/60 space-y-2">
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Grounded Statutory Citations:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.citations.map((c, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 text-[11px] border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-xs">
                            <span className="truncate pr-2 font-medium"><strong>{c.source}</strong> ({c.reference})</span>
                            <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-semibold border border-blue-500/20 shrink-0">
                              Statute
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
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 text-xs p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 w-fit">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="font-medium">Synthesizing relevant statutory chapters and precedents...</span>
              </div>
            )}
          </div>

          {/* Form input controls */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-800/50 flex items-center gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={`Consult ${activeAgentInfo.name} on Indian statutes, case facts, or legal motions...`}
              className="flex-1 bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/60 px-4 py-2.5 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !userQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 disabled:opacity-40 transition cursor-pointer"
            >
              <span>Submit</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Right Info and Quick Queries Panel */}
        <div className="bg-white/85 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-5 h-fit">
          <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Chamber Consultation Context
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active persona tailored for your operating profile.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 space-y-2 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>{activeAgentInfo.name}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">{activeAgentInfo.roleDescription}</p>
          </div>

          <div className="space-y-2.5">
            <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Example Jurisprudential Queries
            </div>
            <button
              onClick={() => setUserQuery("What constitutional remedies exist under Article 21 and Article 32 if police detain someone without disclosing grounds?")}
              className="w-full text-left p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-500 text-xs text-slate-800 dark:text-slate-200 font-medium transition cursor-pointer leading-snug"
            >
              Constitutional Writs & Art. 21 Detention Safeguards
            </button>
            <button
              onClick={() => setUserQuery("Explain the punishment for Mob Lynching under Section 103(2) of Bharatiya Nyaya Sanhita 2023.")}
              className="w-full text-left p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-500 text-xs text-slate-800 dark:text-slate-200 font-medium transition cursor-pointer leading-snug"
            >
              Mob Lynching Penalty under Section 103(2) BNS 2023
            </button>
            <button
              onClick={() => setUserQuery("What are the twin conditions for bail under Section 45 of PMLA 2002?")}
              className="w-full text-left p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-500 text-xs text-slate-800 dark:text-slate-200 font-medium transition cursor-pointer leading-snug"
            >
              PMLA Sec 45 Twin Bail Requirements & Burden of Proof
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
