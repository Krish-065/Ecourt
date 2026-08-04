import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export const metadata: Metadata = {
  title: 'ECourt - AI Legal Operating System for India ⚖️🇮🇳',
  description: 'Production-ready AI Legal OS for Indian Jurisdiction: Indian Constitution, Bare Acts (BNS, BNSS, BSA, CPC, Consumer Act, Domestic Violence, PMLA), Autonomous AI Counsel, eCourts Case Lookup, Advocate Verification & Vault Encryption.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 min-h-[calc(100vh-65px)]">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
