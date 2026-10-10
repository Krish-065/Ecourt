'use client';

import React, { useState } from 'react';
import { 
  FolderLock, 
  Upload, 
  Lock, 
  ShieldCheck, 
  Download, 
  FileText, 
  Tag, 
  Trash2, 
  CheckCircle2,
  Scale,
  Key
} from 'lucide-react';

export default function DocumentVaultPage() {
  const [documents, setDocuments] = useState([
    {
      id: 'doc_1',
      originalName: 'Land_Title_Deed_Delhi_2026.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 4250000,
      encryptedAlgorithm: 'AES-256-GCM',
      caseTitle: 'Priya Verma vs. State of NCT Delhi',
      tags: ['Property Deed', 'High Court Evidence'],
      createdAt: '2026-07-20',
    },
    {
      id: 'doc_2',
      originalName: 'FIR_Copy_BNS_Section_329.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1850000,
      encryptedAlgorithm: 'AES-256-GCM',
      caseTitle: 'Priya Verma vs. State of NCT Delhi',
      tags: ['Police FIR', 'BNS 2023'],
      createdAt: '2026-07-22',
    },
    {
      id: 'doc_3',
      originalName: 'Shareholders_Agreement_Nexus.docx',
      mimeType: 'application/word',
      sizeBytes: 2900000,
      encryptedAlgorithm: 'AES-256-GCM',
      caseTitle: 'Nexus Retail Corporate Vault',
      tags: ['Contract', 'Companies Act'],
      createdAt: '2026-07-25',
    },
  ]);

  const [uploading, setUploading] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);

    setTimeout(() => {
      setDocuments((prev) => [
        {
          id: `doc_${Date.now()}`,
          originalName: file.name,
          mimeType: file.type || 'application/pdf',
          sizeBytes: file.size,
          encryptedAlgorithm: 'AES-256-GCM',
          caseTitle: 'Personal Legal Vault',
          tags: ['Encrypted Evidence'],
          createdAt: new Date().toISOString().split('T')[0],
        },
        ...prev,
      ]);
      setUploading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderLock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Client Privilege Evidence Vault
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Zero-knowledge client-side encryption. Legal deeds, affidavits, and privilege documents are encrypted before hitting disk.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white font-semibold border border-slate-200/80 dark:border-slate-700/60">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span className="font-mono text-[11px]">AES-256-GCM Guard Active</span>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="p-8 rounded-2xl bg-white/85 dark:bg-slate-900/60 border-2 border-dashed border-slate-300 dark:border-slate-700/80 text-center space-y-3 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 relative shadow-xs backdrop-blur-xl">
        <input
          type="file"
          onChange={handleSimulatedUpload}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
          <Upload className="h-6 w-6" />
        </div>
        <div>
          <p className="text-base font-bold text-slate-900 dark:text-white">Deposit Legal Evidence or Case Briefs</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Drag and drop confidential PDF, DOCX, or scanned exhibits (Encrypted locally before transmission)
          </p>
        </div>
        {uploading && (
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center justify-center gap-2 font-mono">
            <Lock className="h-3.5 w-3.5 animate-pulse text-blue-600 dark:text-blue-400" /> Generating cryptographic key & encrypting buffer...
          </p>
        )}
      </div>

      {/* Vault List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Encrypted Chamber Documents ({documents.length})
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Client-Attorney Privilege Protected
          </span>
        </div>

        <div className="rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th className="p-3.5">Document Name & Protocol</th>
                  <th className="p-3.5">Matter Reference & Category</th>
                  <th className="p-3.5">Payload Size</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{doc.originalName}</p>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mt-0.5 inline-block">
                            <Lock className="h-2.5 w-2.5 inline mr-1" /> {doc.encryptedAlgorithm}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <p className="text-slate-900 dark:text-white font-semibold">{doc.caseTitle}</p>
                      <div className="flex gap-1.5 mt-1">
                        {doc.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200/80 dark:border-slate-700/60">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400 font-medium">
                      {(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => alert(`Decrypting ${doc.originalName} with AES-256 session key...`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Decrypt & Open</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
