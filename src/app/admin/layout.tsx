'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      // Redirect to a 403 page or home
      // router.push('/403');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-[#0058bc]" />
        <p className="mt-4 text-neutral-500">Authenticating administrative access...</p>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-neutral-200 mb-6" />
        <h1 className="text-4xl font-black italic tracking-tighter text-neutral-900 uppercase">Access Restricted</h1>
        <p className="mt-4 text-neutral-500 max-w-lg mx-auto">
          You are attempting to access a secured administrative area without sufficient authorization. Please contact your system administrator if you believe this is an error.
        </p>
        <Link href="/" className="btn-primary mt-10 inline-block">
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-100 bg-white px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0058bc] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0058bc]" /> Global Admin Console Active
           </div>
           <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Standard Administrative Authorization
           </div>
        </div>
      </div>
      {children}
    </div>
  );
}
