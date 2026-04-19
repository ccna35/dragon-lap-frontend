'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { OrderWithItems } from '@/types/api';
import { formatEGP, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Clock, CheckCircle, Package, Truck, X, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING:          { label: 'Pending',       icon: Clock,        cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED:        { label: 'Confirmed',      icon: CheckCircle,  cls: 'bg-blue-50 text-[#0057D9] border-blue-200' },
  PREPARING:        { label: 'Preparing',      icon: Package,      cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', icon: Truck,      cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  DELIVERED:        { label: 'Delivered',      icon: CheckCircle,  cls: 'bg-green-50 text-green-700 border-green-200' },
  CANCELLED:        { label: 'Cancelled',      icon: X,            cls: 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]' },
} as const;

export default function MyOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get<OrderWithItems[]>('/orders/my');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0057D9]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:px-6">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#111113]">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#374151]">My orders</span>
        </nav>

        <h1 className="mb-8 text-2xl font-bold tracking-tight text-[#111113]">My orders</h1>

        {!orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E7EB] py-24 text-center">
            <ShoppingBag className="mb-4 h-10 w-10 text-[#E5E7EB]" />
            <h2 className="text-base font-semibold text-[#111113]">No orders yet</h2>
            <p className="mt-2 text-sm text-[#6B7280]">Your order history will appear here once you make a purchase.</p>
            <Link href="/laptops" className="btn-primary mt-6">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = cfg.icon;
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="group flex flex-col gap-4 rounded-xl border border-[#E5E7EB] p-5 transition-all hover:border-[#D1D5DB] hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-5">
                    {/* Status icon */}
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${cfg.cls}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#111113]">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className={`badge border ${cfg.cls} text-xs`}>{cfg.label}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#9CA3AF]">
                        {formatDate(order.createdAt)} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-10">
                    <div className="text-right">
                      <p className="text-xs text-[#9CA3AF]">Total</p>
                      <p className="text-sm font-bold text-[#111113]">{formatEGP(order.total)}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#D1D5DB] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
