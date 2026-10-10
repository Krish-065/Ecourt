'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <main className="flex-1 w-full h-full min-h-0 overflow-y-auto">
        {children}
      </main>
    );
  }

  return (
    <main className="flex-1 h-full min-h-0 p-5 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full pb-10">
        {children}
      </div>
    </main>
  );
}
