'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { queryAIAgent } from '../../lib/api';
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
  Info
} from 'lucide-react';

export default function AIChatWorkspace() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const [selectedAgent, setSelectedAgent] = useState('CITIZEN_ADVISOR');
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    sender: 'USER' | 'ASSISTANT';
    text: string;
    citations?: any[];
    confidence?: number;
    agentName?: string;
    provider?: string;
  }>>([]);

  const agentList = [
    { id: 'CITIZEN_ADVISOR', name: 'Citizen Advisor Agent', roleDescription: 'Explains rights & BNSS FIR rules in plain language', iconName: 'UserCheck' },
    { id: 'ADVOCATE_ASSISTANT', name: 'Advocate Assistant Agent', roleDescription: 'Drafts petitions, bail pleas & cross-exam strategies', iconName: 'Gavel' },
    { id: 'LAW_STUDENT_TUTOR', name: 'Law Student Tutor Agent', roleDescription: 'Socratic teaching of Indian Constitutional ratio decidendi', iconName: 'GraduationCap' },
    { id: 'BUSINESS_COMPLIANCE', name: 'Business Advisor Agent', roleDescription: 'Companies Act, GST statutory compliance & contract risks', iconName: 'Building2' },
    { id: 'CASE_STRATEGY_PLANNER', name: 'Strategy Planner Agent', roleDescription: 'Litigation risk modeling & defense precedent mapping', iconName: 'Target' },
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
          setSelectedAgent('CASE_STRATEGY_PLANNER'); // Default / Admin
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
          provider: 'Supercore AI'
        })));
      } else {
        setMessages([
          {
            sender: 'ASSISTANT',
            text: `Welcome to your practice room. I am initialized as your specialized **${currentAgentInfo.name}**. I am grounded in the Constitution of India, BNS 2023, BNSS 2023, BSA 2023, CPC, and landmark Supreme Court jurisprudence.\n\nAsk me any complex legal query or talk naturally with me to get statutory guidance and action steps.`,
            citations: [],
            confidence: 98.0,
            agentName: currentAgentInfo.name,
            provider: 'Supercore AI'
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
    const assistantText = res.response || res.detail || 'Unable to compute RAG response.';
    const confidenceScore = res.confidence_score || 94.0;
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
        provider: res.provider || 'Supercore AI',
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
          text: `Chat history reset. Ask me any question regarding Indian law under the **${currentAgentInfo.name}** context.`,
          citations: [],
          confidence: 99.0,
          agentName: currentAgentInfo.name,
          provider: 'Supercore AI'
        }
      ]);
    } catch (e) {
      console.error('Failed to clear chat sessions:', e);
    }
  };

  // Modern UI parser converting text section blocks into beautiful card components
  const renderFormattedResponse = (text: string) => {
    // Remove raw emojis/symbols in an ES5-compatible manner
    let cleanText = text
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
      .replace(/[\u2600-\u27BF]/g, '');

    const sections = [
      { key: 'Direct Legal Answer & Statutory Ratio', label: 'Direct Legal Answer & Statutory Ratio', icon: Scale, color: 'border-slate-300 bg-slate-50/50 text-slate-800' },
      { key: 'Key Rights & Remedies Available', label: 'Key Rights & Remedies Available', icon: ShieldCheck, color: 'border-indigo-500 bg-indigo-50/30 text-slate-800' },
      { key: 'Step-by-Step Action Plan / Filing Guidance', label: 'Step-by-Step Action Plan / Filing Guidance', icon: CheckSquare, color: 'border-emerald-500 bg-emerald-50/30 text-slate-800' },
      { key: 'Grounded Statutory & Precedent Footnotes', label: 'Grounded Statutory & Precedent Footnotes', icon: BookOpen, color: 'border-amber-500 bg-amber-50/30 text-slate-800' }
    ];

    let isStructured = false;
    for (const s of sections) {
      if (cleanText.includes(s.key)) {
        isStructured = true;
        break;
      }
    }

    if (!isStructured) {
      return <div className="whitespace-pre-wrap leading-relaxed">{cleanText}</div>;
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
            <div key={i} className={`p-4 rounded-2xl border-l-4 ${sect.color} shadow-2xs space-y-2`}>
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                <IconComponent className="h-4 w-4 text-indigo-600" />
                <span>{sect.label}</span>
              </div>
              <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-semibold">
                {part.replace(/^[:\s\-*]+/g, '').trim()}
              </div>
            </div>
          );
          currentHeader = '';
        } else {
          renderedElements.push(
            <div key={i} className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-semibold">
              {part}
            </div>
          );
        }
      }
    }

    return <div className="space-y-3.5">{renderedElements}</div>;
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6">
        <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900">Sign In to Save Chat History</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Persistent legal chats, case records, and RAG histories are stored securely in your private encrypted database space.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <Link 
            href="/register" 
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition"
          >
            Create Free Account
          </Link>
          <Link 
            href="/auth" 
            className="w-full py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-extrabold text-xs transition flex items-center justify-center gap-1.5"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In to Existing Account</span>
          </Link>
        </div>
      </div>
    );
  }

  const activeAgentInfo = agentList.find(a => a.id === selectedAgent) || agentList[0];

  return (
    <div className="space-y-6 min-h-screen relative pb-12">
      {/* Background premium grid layout */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e2e8f0_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none opacity-60"></div>
      
      {/* Header section with high-end premium details */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Scale className="h-5 w-5 text-indigo-600" />
            Aura AI Workspace
          </h1>
          <p className="text-xs text-slate-500 font-bold">
            Interactive, statutory-grounded consulting environment connected to BNS, BNSS, and landmark precedents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-extrabold shadow-2xs">
            <Cpu className="h-3.5 w-3.5 text-indigo-600" /> Grounded AI Engine
          </div>
          <button
            onClick={handleClearChat}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold border border-slate-200 transition"
            title="Reset Session History"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main layout thread */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main conversation box */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[580px]">
          {/* Active Agent Info Banner */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-950">Active Engine: {activeAgentInfo.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                Statutory Verified
              </span>
            </div>
          </div>

          {/* Message Thread Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl ${
                  msg.sender === 'USER'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-sm font-semibold'
                    : 'bg-slate-50/80 border border-slate-200 text-slate-900 rounded-bl-none shadow-2xs'
                }`}>
                  {msg.sender === 'ASSISTANT' && (
                    <div className="flex items-center justify-between text-[9px] text-slate-400 pb-2 mb-2 border-b border-slate-150">
                      <span className="font-bold text-indigo-600 uppercase tracking-wider">
                        {msg.agentName || 'AI Counsel'}
                      </span>
                      {msg.confidence && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          {msg.confidence}% Statutorily Grounded
                        </span>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    {msg.sender === 'ASSISTANT' ? renderFormattedResponse(msg.text) : msg.text}
                  </div>

                  {/* Precedent references footnotes */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 mt-3 border-t border-slate-200 space-y-1.5">
                      <p className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> Grounded Statutory Citations:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.citations.map((c, idx) => (
                          <div key={idx} className="p-2 rounded-xl bg-white text-[10px] border border-slate-200 text-slate-600 flex items-center justify-between shadow-3xs font-medium">
                            <span className="truncate pr-1"><strong>{c.source}</strong> ({c.reference})</span>
                            <span className="text-[9px] bg-slate-50 text-slate-500 px-1 py-0.2 rounded font-bold border border-slate-100 shrink-0">
                              {(c.relevance_score * 100).toFixed(0)}% Match
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
              <div className="flex items-center gap-2 text-slate-600 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 w-fit">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                <span className="font-semibold">Retrieving relevant statutory chapters and analyzing Indian penal codes...</span>
              </div>
            )}
          </div>

          {/* Form input controls */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-slate-50/60 rounded-b-3xl flex items-center gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={`Ask ${activeAgentInfo.name} any legal question under Indian Jurisdiction...`}
              className="flex-1 glass-input px-4 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/10 flex items-center gap-1.5 disabled:opacity-50 transition"
            >
              <span>Submit</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Informative practice panel */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <Info className="h-4 w-4 text-indigo-600" />
            Workspace Instructions
          </h3>

          <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-150 text-xs text-slate-700 space-y-2.5 font-medium leading-relaxed">
            <p>
              Your agent context has been automatically adjusted based on your logged-in profile.
            </p>
            <div className="flex items-start gap-2 pt-1">
              <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong>Active Context:</strong> {activeAgentInfo.roleDescription}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Example Legal Queries</h4>
            <button
              onClick={() => setUserQuery("What constitutional remedies exist under Article 21 and Article 32 if police detain someone without disclosing grounds?")}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-500 text-xs text-slate-700 font-semibold transition"
            >
              Constitutional Writs & Art 21 Detention Remedies
            </button>
            <button
              onClick={() => setUserQuery("Explain the punishment for Mob Lynching under Section 103(2) of Bharatiya Nyaya Sanhita 2023.")}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-500 text-xs text-slate-700 font-semibold transition"
            >
              Mob Lynching Penalty under Sec 103(2) BNS 2023
            </button>
            <button
              onClick={() => setUserQuery("What are the twin conditions for bail under Section 45 of PMLA 2002?")}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-500 text-xs text-slate-700 font-semibold transition"
            >
              PMLA Sec 45 Twin Bail Conditions & ED Arrest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
