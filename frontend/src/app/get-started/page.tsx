'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GetStartedRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold text-xs">
      Redirecting to Legal OS...
    </div>
  );
}
