'use client';

import React from 'react';
import { UserCheck, Gavel, GraduationCap, Building2, Target, FileSearch, Search, BookmarkCheck, Scale, ShieldAlert } from 'lucide-react';

export interface AgentCardProps {
  id: string;
  name: string;
  roleDescription: string;
  iconName: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function AgentCard({ id, name, roleDescription, iconName, isSelected, onSelect }: AgentCardProps) {
  const getIcon = () => {
    switch (iconName) {
      case 'Gavel': return <Gavel className="h-5 w-5 text-blue-600" />;
      case 'GraduationCap': return <GraduationCap className="h-5 w-5 text-indigo-600" />;
      case 'Building2': return <Building2 className="h-5 w-5 text-sky-600" />;
      case 'Target': return <Target className="h-5 w-5 text-rose-600" />;
      case 'FileSearch': return <FileSearch className="h-5 w-5 text-blue-600" />;
      case 'Search': return <Search className="h-5 w-5 text-slate-700" />;
      case 'BookmarkCheck': return <BookmarkCheck className="h-5 w-5 text-emerald-600" />;
      case 'Scale': return <Scale className="h-5 w-5 text-blue-600" />;
      default: return <UserCheck className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <button
      onClick={() => onSelect(id)}
      className={`text-left p-4 rounded-xl flex flex-col justify-between transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'bg-blue-50/70 border-2 border-blue-600 shadow-sm ring-2 ring-blue-500/10'
          : 'bg-white border border-slate-200 hover:border-blue-400 hover:bg-slate-50/80 shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between w-full mb-3">
        <div className={`p-2.5 rounded-lg border ${isSelected ? 'bg-white border-blue-200 shadow-xs' : 'bg-slate-50 border-slate-200'}`}>
          {getIcon()}
        </div>
        {isSelected ? (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white uppercase tracking-wider">
            Active Counsel
          </span>
        ) : (
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Select
          </span>
        )}
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-1">{name}</h4>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{roleDescription}</p>
      </div>
    </button>
  );
}
