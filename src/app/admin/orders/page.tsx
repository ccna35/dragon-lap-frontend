'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { OrderWithItemsAndUser } from '@/types/api';
import { formatEGP, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  Clock,
  CheckCircle,
  Truck,
  Box,
  X,
  Loader2,
  Filter
} from 'lucide-react';
import { useState } from 'react';

const STATUS_CONFIG = {
  PENDING:          { label: 'Pending',   icon: Clock,       cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED:        { label: 'Confirmed', icon: CheckCircle, cls: 'bg-blue-50 text-[#0057D9] border-blue-200' },
  PREPARING:        { label: 'Preparing', icon: Box,         cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  OUT_FOR_DELIVERY: { label: 'Shipped',   icon: Truck,       cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  DELIVERED:        { label: 'Delivered', icon: CheckCircle, cls: 'bg-green-50 text-green-700 border-green-200' },
  CANCELLED:        { label: 'Cancelled', icon: X,           cls: 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]' },
} as const;

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', status],
    queryFn: async () => {
      const res = await api.get<OrderWithItemsAndUser[]>(`/admin/orders${status ? `?status=${status}` : ''}`);
      return res.data;
    },
  });

  const filteredOrders = orders?.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8 md:px-6">
        
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111113]">Orders</h1>
            <p className="mt-1 text-sm text-[#6B7280]">Manage customer orders and fulfillment</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
             <Filter className="h-4 w-4 text-[#9CA3AF] hidden sm:block" />
             <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field bg-white sm:min-w-[180px]"
             >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PREPARING">Preparing</option>
                <option value="OUT_FOR_DELIVERY">Shipped / Out</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
             </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
               <Loader2 className="h-6 w-6 animate-spin text-[#0057D9]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#F3F4F6]">
                <thead className="bg-[#F9FAFB]">
                  <tr>
                    <th className="py-3.5 pl-5 pr-3 text-left text-xs font-semibold text-[#6B7280]">Order ID</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#6B7280]">Customer</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#6B7280] hidden sm:table-cell">Date</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#6B7280]">Status</th>
                    <th className="px-3 py-3.5 text-right text-xs font-semibold text-[#6B7280] pr-5">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {filteredOrders?.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="py-16 text-center text-sm text-[#9CA3AF]">
                           No orders found matching criteria.
                        </td>
                     </tr>
                  ) : (
                    filteredOrders?.map((order) => {
                      const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                      return (
                        <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors group">
                          <td className="py-4 pl-5 pr-3">
                            <Link href={`/admin/orders/${order.id}`} className="font-medium text-[#111113] hover:text-[#0057D9]">
                               #{order.id.slice(0, 8).toUpperCase()}
                            </Link>
                          </td>
                          <td className="px-3 py-4">
                             <p className="text-sm font-medium text-[#374151]">{order.user.fullName}</p>
                             <p className="text-xs text-[#9CA3AF] hidden sm:block">{order.city}</p>
                          </td>
                          <td className="px-3 py-4 text-sm text-[#6B7280] hidden sm:table-cell">
                             {formatDate(order.createdAt)}
                          </td>
                          <td className="px-3 py-4">
                             <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${cfg.cls}`}>
                                <cfg.icon className="h-3 w-3" /> {cfg.label}
                             </span>
                          </td>
                          <td className="py-4 pl-3 pr-5 text-right font-medium text-[#111113]">
                             {formatEGP(order.total)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
