'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Globe, 
  Zap, 
  AlertTriangle,
  Gavel
} from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 py-8 px-4 max-w-5xl mx-auto relative">
      
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-extrabold shadow-2xs">
          <Sparkles className="h-4 w-4 text-amber-500 fill-amber-400" />
          <span>Next-Gen AI Legal Operating System for India ⚖️🇮🇳</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Simplifying Justice with <br className="hidden md:inline" />
          <span className="gradient-text">Statutory AI Intelligence</span>
        </h1>

        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Indian legal research and case management system powered by our secure AI engine. Grounded in the Constitution of India, BNS, BNSS, BSA, and eCourts live API.
        </p>

        <div className="flex justify-center pt-2">
          <Link 
            href="/register" 
            className="group px-8 py-4.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 transition transform hover:-translate-y-0.5 duration-200"
          >
            <span>Get Started & Access Legal OS</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Technical Validation Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-200 text-left max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900">Anti-Hallucination RAG</p>
              <p className="text-[10px] text-slate-500 font-medium">100% Statutory Citations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-indigo-600 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900">AES-256 Client Vault</p>
              <p className="text-[10px] text-slate-500 font-medium">Encrypted Document Shield</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900">Criminal Codes 2023</p>
              <p className="text-[10px] text-slate-500 font-medium">BNS, BNSS & BSA Ingested</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-amber-500 fill-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900">Sub-Second Inference</p>
              <p className="text-[10px] text-slate-500 font-medium">High Performance Core</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Comparison Layout */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900">The Problem & How ECourt Solves It</h2>
          <p className="text-xs text-slate-600">Addressing the critical bottlenecks in the Indian Judicial System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: The Problem */}
          <div className="p-6 md:p-8 rounded-3xl bg-rose-50/60 border border-rose-200 space-y-5">
            <div className="flex items-center gap-2 text-rose-800">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
              <h3 className="text-lg font-bold">The Indian Litigation Crisis</h3>
            </div>
            
            <ul className="space-y-4 text-xs font-medium text-slate-700">
              <li className="flex gap-2">
                <span className="text-rose-600 font-bold">❌</span>
                <div>
                  <strong className="text-slate-900">5 Crore+ Backlogged Cases:</strong>
                  <p className="text-slate-600 mt-0.5">Citizens wait years for minor disputes due to paper-heavy workflows.</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-rose-600 font-bold">❌</span>
                <div>
                  <strong className="text-slate-900">Opaque Statutory Languages:</strong>
                  <p className="text-slate-600 mt-0.5">Navigating new 2023 acts (BNS, BNSS, BSA) is confusing for citizens and scholars.</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-rose-600 font-bold">❌</span>
                <div>
                  <strong className="text-slate-900">Hallucinating General AI Models:</strong>
                  <p className="text-slate-600 mt-0.5">Standard LLMs invent fake court precedents, making them dangerous for legal use.</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-rose-600 font-bold">❌</span>
                <div>
                  <strong className="text-slate-900">Security & Privileged Data Exposure:</strong>
                  <p className="text-slate-600 mt-0.5">Advocate files and client documents are uploaded to unencrypted servers.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Column: The ECourt Solution */}
          <div className="p-6 md:p-8 rounded-3xl bg-indigo-50/60 border border-indigo-200 space-y-5">
            <div className="flex items-center gap-2 text-indigo-800">
              <CheckCircle2 className="h-6 w-6 text-indigo-600" />
              <h3 className="text-lg font-bold">The ECourt AI Legal OS Solution</h3>
            </div>

            <ul className="space-y-4 text-xs font-medium text-slate-700">
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <div>
                  <strong className="text-slate-900">Sub-second eCourts CNR Sync:</strong>
                  <p className="text-slate-600 mt-0.5">Track case hearings, updates, and orders instantly via live government APIs.</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <div>
                  <strong className="text-slate-900">Zero-Hallucination Grounded AI:</strong>
                  <p className="text-slate-600 mt-0.5">Every legal answer links to active Bare Acts and Supreme Court landmark ratio decidendi.</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <div>
                  <strong className="text-slate-900">BNS vs IPC Cross-Mapping Engine:</strong>
                  <p className="text-slate-600 mt-0.5">Instantly translate old IPC sections into the corresponding BNS 2023 laws.</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <div>
                  <strong className="text-slate-900">Client Privilege Vault with AES-256:</strong>
                  <p className="text-slate-600 mt-0.5">Document vaults encrypt files before they hit storage. Perfect client privacy.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
        
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2">
            <Gavel className="h-5 w-5 text-amber-400" />
            Ready to explore your specialized workspace?
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Join thousands of Advocates, Businesses, Students, and Citizens using ECourt AI.
          </p>
        </div>

        <Link 
          href="/register" 
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition"
        >
          <span>Get Started Now</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

    </div>
  );
}
