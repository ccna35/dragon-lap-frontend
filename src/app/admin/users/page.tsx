'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { UserPublic } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { Search, Loader2, Shield, User, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get<UserPublic[]>('/users');
      return res.data;
    },
  });

  const filteredUsers = users?.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8 md:px-6">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111113]">Users</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              {users?.length ?? 0} total registered accounts
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 bg-white"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-[#0057D9]" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#F3F4F6]">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="py-3.5 pl-5 pr-3 text-left text-xs font-semibold text-[#6B7280]">User</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#6B7280] hidden sm:table-cell">Contact</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#6B7280] hidden md:table-cell">Joined</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#6B7280]">Role</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#6B7280] hidden sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9FAFB]">
                {filteredUsers?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm text-[#9CA3AF]">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers?.map((user) => (
                    <tr key={user.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-4 pl-5 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[#0057D9] font-bold">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#111113]">{user.fullName}</p>
                            <p className="text-xs text-[#9CA3AF] sm:hidden">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 hidden sm:table-cell">
                        <div className="text-sm text-[#374151]">{user.email}</div>
                        <div className="text-xs text-[#9CA3AF]">{user.phone || 'No phone'}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-[#374151] hidden md:table-cell">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-3 py-4">
                        {user.role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#EEF4FF] px-2 py-1 text-xs font-semibold text-[#0057D9]">
                            <Shield className="h-3 w-3" /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B7280]">
                            <User className="h-3 w-3" /> Customer
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 hidden sm:table-cell">
                         {user.isActive ? (
                           <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 border border-green-200">
                             <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active
                           </span>
                         ) : (
                           <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F9FAFB] px-2.5 py-0.5 text-xs font-medium text-[#6B7280] border border-[#E5E7EB]">
                             <span className="h-1.5 w-1.5 rounded-full bg-[#6B7280]" /> Inactive
                           </span>
                         )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
