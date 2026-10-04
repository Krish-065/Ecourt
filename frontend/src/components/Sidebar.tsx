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
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface UserRole {
  role?: string;
  fullName?: string;
  full_name?: string;
  email?: string;
}

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

  // Role-customized navigation labels and contextual badges
  const getNavItems = () => {
    switch (role) {
      case 'ADVOCATE':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: 'Overview' },
          { name: 'AI Co-Counsel', href: '/ai-chat', icon: Bot, badge: 'Drafting' },
          { name: 'Case Portfolio', href: '/cases', icon: Briefcase, badge: 'CNR Sync' },
          { name: 'Evidence Vault', href: '/vault', icon: FolderLock, badge: 'Encrypted' },
          { name: 'Statutory Research', href: '/research', icon: BookOpenCheck, badge: 'BNS 2023' },
          { name: 'Contract & FIR Audit', href: '/analyzers', icon: FileCheck2 },
          { name: 'Colleague Directory', href: '/advocates', icon: Users },
        ];
      case 'LAW_STUDENT':
        return [
          { name: 'Study Desk', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Moot Mentor AI', href: '/ai-chat', icon: Bot, badge: 'Tutor' },
          { name: 'Landmark Cases', href: '/cases', icon: Briefcase },
          { name: 'Moot Brief Vault', href: '/vault', icon: FolderLock },
          { name: 'Jurisprudence Search', href: '/research', icon: BookOpenCheck, badge: 'Constitutional' },
          { name: 'Case Law Analysis', href: '/analyzers', icon: FileCheck2 },
          { name: 'Senior Directory', href: '/advocates', icon: Users, badge: 'Mentorship' },
        ];
      case 'BUSINESS':
        return [
          { name: 'Compliance HQ', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Corporate AI Counsel', href: '/ai-chat', icon: Bot, badge: 'Advisory' },
          { name: 'Dispute Docket', href: '/cases', icon: Briefcase },
          { name: 'Corporate Vault', href: '/vault', icon: FolderLock, badge: 'NDAs & IP' },
          { name: 'Regulatory Research', href: '/research', icon: BookOpenCheck },
          { name: 'Contract Risk Scanner', href: '/analyzers', icon: FileCheck2, badge: 'Audit' },
          { name: 'Legal Panel Directory', href: '/advocates', icon: Users, badge: 'Retainers' },
        ];
      case 'CITIZEN':
      default:
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Citizen Legal Advisor', href: '/ai-chat', icon: Bot, badge: 'Plain Speak' },
          { name: 'My Case Status', href: '/cases', icon: Briefcase, badge: 'Live Updates' },
          { name: 'Personal Records', href: '/vault', icon: FolderLock, badge: 'Private' },
          { name: 'Legal Rights & Laws', href: '/research', icon: BookOpenCheck },
          { name: 'FIR & Notice Analyzer', href: '/analyzers', icon: FileCheck2 },
          { name: 'Find an Advocate', href: '/advocates', icon: Users, badge: 'Verified' },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-65px)]">
      <div className="p-4 space-y-6">
        {/* Role identification card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-blue-600 font-semibold">Active Session</span>
            <Shield className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="font-bold text-slate-900 text-sm capitalize">
            {role.toLowerCase().replace('_', ' ')} Portal
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-0.5 truncate">
            {user?.fullName || user?.full_name || user?.email || 'Authorized Member'}
          </p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-3 mb-2 font-bold">
            Core Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider shrink-0 ${
                      isActive
                        ? 'bg-blue-700 text-blue-100'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Support / Security badge */}
      <div className="p-4 border-t border-slate-200">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="text-[11px] leading-tight">
            <div className="text-slate-900 font-semibold">National Grid Connected</div>
            <div className="text-slate-500 text-[10px]">India eCourts Network</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
