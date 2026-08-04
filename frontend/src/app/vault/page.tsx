'use client';

import React, { useState } from 'react';
import { FolderLock, Upload, Lock, ShieldCheck, Download, FileText, Tag, Trash2, CheckCircle2 } from 'lucide-react';

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
      caseTitle: 'Corporate Vault',
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
          tags: ['Encrypted Vault Upload'],
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FolderLock className="h-6 w-6 text-emerald-600" />
            Encrypted Document Vault (AES-256-GCM)
          </h1>
          <p className="text-xs text-slate-600">
            Zero-knowledge client-side encryption. All legal contracts, deeds, and evidence files are encrypted before storage.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 text-xs text-emerald-800 font-bold border border-emerald-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> AES-256 Vault Guard Active
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="p-8 rounded-3xl bg-white border-2 border-dashed border-indigo-200 text-center space-y-3 hover:border-indigo-500 transition relative shadow-sm">
        <input
          type="file"
          onChange={handleSimulatedUpload}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200">
          <Upload className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-slate-900">Click or drag legal documents to encrypt and upload</p>
          <p className="text-xs text-slate-500 mt-0.5">Supports PDF, DOCX, PNG, JPG (Max 25 MB)</p>
        </div>
        {uploading && (
          <p className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-2">
            <Lock className="h-3.5 w-3.5 animate-pulse text-emerald-600" /> Encrypting buffer with AES-256 key...
          </p>
        )}
      </div>

      {/* Vault List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stored Encrypted Legal Records</h3>

        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">File Name & Encryption</th>
                <th className="p-3.5">Associated Case / Tag</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">{doc.originalName}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200">
                          <Lock className="h-2.5 w-2.5 inline mr-1 text-emerald-600" /> {doc.encryptedAlgorithm}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <p className="text-slate-900 font-semibold">{doc.caseTitle}</p>
                    <div className="flex gap-1 mt-1">
                      {doc.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 font-bold">
                    {(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => alert(`Decrypting ${doc.originalName} with AES-256 session key...`)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Decrypt & Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
