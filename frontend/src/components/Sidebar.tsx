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
  UserCheck,
  UserPlus,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

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

  const navItems = [
    { name: 'HQ', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Aura AI', href: '/ai-chat', icon: Bot, badge: 'Legal Guru' },
    { name: 'Case Radar', href: '/cases', icon: Briefcase, badge: 'Live Feed' },
    { name: 'Vibe Check', href: '/register', icon: UserPlus, badge: 'Verify ID' },
    { name: 'Risk Scan', href: '/analyzers', icon: FileCheck2 },
    { name: 'Lex Search', href: '/research', icon: BookOpenCheck },
    { name: 'Fort Knox Vault', href: '/vault', icon: FolderLock, badge: 'AES-256' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-65px)] shadow-xs shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Legal OS Navigation</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge ? (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                      item.badge === 'Legal Guru' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      item.badge === 'Verify ID' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                      item.badge === 'Live Feed' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="h-3 w-3 opacity-40 text-slate-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Health Widget */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">System Aura & Storage</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
            Indian Constitution, BNS, BNSS, BSA, Consumer Protection & PMLA legal modules synced and secure.
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-200 font-bold">
            <span>Secure Core Locker</span>
            <span className="text-emerald-700 font-bold">Online & Guarded</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="px-3 py-2 text-[11px] text-slate-500 text-center border-t border-slate-100 font-bold">
        ECourt AI Legal OS • Indian Jurisdiction
      </div>
    </aside>
  );
}
