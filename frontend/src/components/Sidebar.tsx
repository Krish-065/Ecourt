'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Briefcase,
  FolderLock,
  FileCheck2,
  BookOpenCheck,
  Users,
  LogOut,
} from 'lucide-react';

interface UserRole {
  role?: string;
  fullName?: string;
  full_name?: string;
  email?: string;
}

const roleDisplayMap: Record<string, string> = {
  CITIZEN: 'Citizen',
  ADVOCATE: 'Advocate',
  LAW_STUDENT: 'Law Student',
  BUSINESS: 'Corporate',
  ADMIN: 'Administrator',
};

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserRole | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ecourt_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    } else {
      setUser(null);
    }
  }, [pathname]);

  const publicRoutes = ['/', '/auth', '/register', '/get-started'];
  
  if (publicRoutes.includes(pathname) || !user) {
    return null;
  }

  const role = user?.role || 'CITIZEN';
  const roleTitle = roleDisplayMap[role] || 'Citizen';
  const displayName = user?.fullName || user?.full_name || user?.email || 'User';

  const handleLogout = () => {
    localStorage.removeItem('ecourt_user');
    localStorage.removeItem('ecourt_token');
    window.location.href = '/';
  };

  // Role-customized navigation labels (uncluttered, without badges)
  const getNavItems = () => {
    switch (role) {
      case 'ADVOCATE':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'AI Co-Counsel', href: '/ai-chat', icon: Bot },
          { name: 'Case Portfolio', href: '/cases', icon: Briefcase },
          { name: 'Evidence Vault', href: '/vault', icon: FolderLock },
          { name: 'Statutory Research', href: '/research', icon: BookOpenCheck },
          { name: 'Contract & FIR Audit', href: '/analyzers', icon: FileCheck2 },
          { name: 'Colleague Directory', href: '/advocates', icon: Users },
        ];
      case 'LAW_STUDENT':
        return [
          { name: 'Study Desk', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Mentor AI', href: '/ai-chat', icon: Bot },
          { name: 'Landmark Cases', href: '/cases', icon: Briefcase },
          { name: 'Brief Vault', href: '/vault', icon: FolderLock },
          { name: 'Jurisprudence Search', href: '/research', icon: BookOpenCheck },
          { name: 'Case Law Analysis', href: '/analyzers', icon: FileCheck2 },
          { name: 'Senior Directory', href: '/advocates', icon: Users },
        ];
      case 'BUSINESS':
        return [
          { name: 'Compliance HQ', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Corporate AI Counsel', href: '/ai-chat', icon: Bot },
          { name: 'Dispute Docket', href: '/cases', icon: Briefcase },
          { name: 'Corporate Vault', href: '/vault', icon: FolderLock },
          { name: 'Regulatory Research', href: '/research', icon: BookOpenCheck },
          { name: 'Contract Risk Scanner', href: '/analyzers', icon: FileCheck2 },
          { name: 'Legal Panel Directory', href: '/advocates', icon: Users },
        ];
      case 'CITIZEN':
      default:
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Citizen Legal Advisor', href: '/ai-chat', icon: Bot },
          { name: 'My Case Status', href: '/cases', icon: Briefcase },
          { name: 'Personal Records', href: '/vault', icon: FolderLock },
          { name: 'Legal Rights & Laws', href: '/research', icon: BookOpenCheck },
          { name: 'FIR & Notice Analyzer', href: '/analyzers', icon: FileCheck2 },
          { name: 'Find an Advocate', href: '/advocates', icon: Users },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 h-full min-h-0 bg-white/80 dark:bg-[#070b14]/90 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hidden md:flex shrink-0 transition-colors duration-200 select-none overflow-hidden">
      {/* Scrollable Upper Section (Profile card + Nav list) */}
      <div className="p-4 space-y-5 overflow-y-auto min-h-0 flex-1">
        {/* Simplified User identification card: Role and Username */}
        <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {roleTitle}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate mt-1">
            {displayName}
          </p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2 font-bold">
            Core Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-500/30 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Pinned Bottom Section (Sign Out + Network status always visible at the bottom) */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2 shrink-0 bg-white/50 dark:bg-[#070b14]/50">
        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/15 border border-transparent hover:border-rose-500/20 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>

        <div className="flex items-center gap-2 px-3.5 pt-1 text-[10px] text-slate-500 dark:text-slate-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>India eCourts Connected</span>
        </div>
      </div>
    </aside>
  );
}
