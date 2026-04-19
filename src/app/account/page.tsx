'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { User, Mail, Phone, Calendar, Shield, Package, LogOut, Loader2, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0057D9]" />
      </div>
    );
  }

  if (!user) return null;

  const details = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Phone', value: user.phone || 'Not set' },
    { icon: Calendar, label: 'Member since', value: formatDate(user.createdAt) },
    { icon: Shield, label: 'Account type', value: user.role === 'ADMIN' ? 'Administrator' : 'Customer' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto max-w-4xl px-4 py-10 md:px-6">

        <h1 className="mb-8 text-2xl font-bold tracking-tight text-[#111113]">My account</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* Profile card */}
          <div className="md:col-span-1">
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0057D9] text-2xl font-bold text-white">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-base font-semibold text-[#111113]">{user.fullName}</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">{user.email}</p>

              {user.role === 'ADMIN' && (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#EEF4FF] px-3 py-1 text-xs font-semibold text-[#0057D9]">
                  <Shield className="h-3 w-3" /> Admin
                </span>
              )}

              <div className="mt-6 space-y-2">
                {user.role === 'ADMIN' && (
                  <Link href="/admin/laptops" className="btn-outline w-full justify-center text-sm">
                    Admin dashboard
                  </Link>
                )}
                <button
                  onClick={() => logout()}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          </div>

          {/* Details + quick links */}
          <div className="space-y-5 md:col-span-2">
            {/* Account details */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
              <h3 className="mb-5 text-sm font-semibold text-[#111113]">Account details</h3>
              <div className="space-y-4">
                {details.map((d) => (
                  <div key={d.label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
                      <d.icon className="h-4 w-4 text-[#0057D9]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#9CA3AF]">{d.label}</p>
                      <p className="text-sm font-medium text-[#374151]">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-[#111113]">Quick actions</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  href="/orders"
                  className="group flex items-center justify-between rounded-lg border border-[#E5E7EB] p-4 transition-all hover:border-[#0057D9] hover:bg-[#EEF4FF]"
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-[#0057D9]" />
                    <span className="text-sm font-medium text-[#374151] group-hover:text-[#0057D9]">Order history</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#D1D5DB] group-hover:text-[#0057D9]" />
                </Link>
                <Link
                  href="/cart"
                  className="group flex items-center justify-between rounded-lg border border-[#E5E7EB] p-4 transition-all hover:border-[#0057D9] hover:bg-[#EEF4FF]"
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-[#0057D9]" />
                    <span className="text-sm font-medium text-[#374151] group-hover:text-[#0057D9]">My cart</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#D1D5DB] group-hover:text-[#0057D9]" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
