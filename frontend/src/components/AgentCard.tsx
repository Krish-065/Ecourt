'use client';

import React from 'react';
import { UserCheck, Gavel, GraduationCap, Building2, Target, FileSearch, Search, BookmarkCheck } from 'lucide-react';

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
      case 'Gavel': return <Gavel className="h-5 w-5 text-amber-600" />;
      case 'GraduationCap': return <GraduationCap className="h-5 w-5 text-emerald-600" />;
      case 'Building2': return <Building2 className="h-5 w-5 text-sky-600" />;
      case 'Target': return <Target className="h-5 w-5 text-rose-600" />;
      case 'FileSearch': return <FileSearch className="h-5 w-5 text-purple-600" />;
      case 'Search': return <Search className="h-5 w-5 text-indigo-600" />;
      case 'BookmarkCheck': return <BookmarkCheck className="h-5 w-5 text-teal-600" />;
      default: return <UserCheck className="h-5 w-5 text-indigo-600" />;
    }
  };

  return (
    <button
      onClick={() => onSelect(id)}
      className={`text-left p-3.5 rounded-2xl flex flex-col justify-between transition cursor-pointer ${
        isSelected
          ? 'bg-indigo-50 border-2 border-indigo-600 shadow-md shadow-indigo-600/10'
          : 'bg-white border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between w-full mb-2">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
          {getIcon()}
        </div>
        {isSelected && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase tracking-wider">
            Active
          </span>
        )}
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-900 mb-0.5">{name}</h4>
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{roleDescription}</p>
      </div>
    </button>
  );
}
