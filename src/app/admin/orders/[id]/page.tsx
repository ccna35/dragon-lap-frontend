'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { OrderWithItemsAndUser } from '@/types/api';
import { formatEGP, formatDate, cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import {
  Package,
  MapPin,
  Phone,
  User,
  Clock,
  CheckCircle,
  Truck,
  Box,
  X,
  Loader2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', icon: Clock, cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle, cls: 'bg-blue-50 text-[#0057D9] border-blue-200' },
  PREPARING: { label: 'Preparing', icon: Box, cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  OUT_FOR_DELIVERY: { label: 'Shipped', icon: Truck, cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  DELIVERED: { label: 'Delivered', icon: CheckCircle, cls: 'bg-green-50 text-green-700 border-green-200' },
  CANCELLED: { label: 'Cancelled', icon: X, cls: 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]' },
} as const;

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [updateError, setUpdateError] = useState<string | null>(null);

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const res = await api.get<OrderWithItemsAndUser>(`/admin/orders/${id}`);
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return api.patch(`/admin/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setUpdateError(null);
    },
    onError: (err: any) => {
      setUpdateError(err.response?.data?.message || 'Failed to update order status.');
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0057D9]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-[#E5E7EB]" />
        <h2 className="text-base font-semibold text-[#111113]">Order not found</h2>
        <Link href="/admin/orders" className="btn-secondary mt-4">Return to orders</Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8 md:px-6">

        <Link href="/admin/orders" className="mb-6 flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111113] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        {/* Order Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111113]">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const isActive = order.status === status;
              const isPending = updateStatusMutation.isPending && updateStatusMutation.variables === status;

              return (
                <button
                  key={status}
                  onClick={() => updateStatusMutation.mutate(status)}
                  disabled={isActive || updateStatusMutation.isPending}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 border",
                    isActive 
                      ? `${config.cls} border-current ring-1 ring-current` 
                      : "bg-white border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] active:scale-95 disabled:hover:bg-white disabled:opacity-50"
                  )}
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <config.icon className="h-3.5 w-3.5" />
                  )}
                  <span>{isActive ? `Current: ${config.label}` : `Set ${config.label}`}</span>
                </button>
              );
            })}
          </div>
        </div>

        {updateError && (
          <div className="mb-6 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{updateError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Order Items Table */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              <div className="border-b border-[#E5E7EB] px-6 py-4">
                <h2 className="text-base font-semibold text-[#111113]">Order Items</h2>
              </div>
              <div className="divide-y divide-[#F3F4F6] p-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm font-semibold text-[#6B7280]">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-medium text-[#111113]">{item.laptopTitleSnapshot}</p>
                        <p className="text-xs text-[#9CA3AF]">SKU: {item.laptopId?.slice(0, 8) || 'N/A'} &middot; {formatEGP(item.unitPriceSnapshot)} each</p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#111113] whitespace-nowrap">{formatEGP(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] p-6 space-y-2">
                <div className="flex justify-between text-sm text-[#374151]">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatEGP(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#374151]">
                  <span>Shipping</span>
                  <span className="font-medium">{Number(order.shippingFee) === 0 ? 'Free' : formatEGP(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#E5E7EB]">
                  <span className="font-semibold text-[#111113]">Total paid</span>
                  <span className="text-lg font-bold text-[#111113]">{formatEGP(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Customer Card */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white">
              <div className="border-b border-[#E5E7EB] px-6 py-4">
                <h2 className="text-base font-semibold text-[#111113]">Customer</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[#0057D9] font-bold">
                    {order.user.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[#111113] truncate">{order.user.fullName}</p>
                    <p className="text-sm text-[#6B7280] truncate">{order.user.email}</p>
                  </div>
                </div>

                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Contact Info</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-sm text-[#374151]">
                    <User className="h-4 w-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                    <span>{order.fullName}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[#374151]">
                    <Phone className="h-4 w-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span>{order.phone}</span>
                      {order.alternatePhone && <span className="text-[#6B7280]">{order.alternatePhone}</span>}
                    </div>
                  </div>
                </div>

                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Shipping Address</h3>
                <div className="flex items-start gap-3 text-sm text-[#374151]">
                  <MapPin className="h-4 w-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <div>
                    <p>{order.streetAddress}</p>
                    <p>{order.area}, {order.city}</p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 rounded-md bg-[#F9FAFB] p-3 text-sm border border-[#E5E7EB]">
                    <span className="font-semibold text-[#374151] block mb-1">Delivery note:</span>
                    <span className="text-[#6B7280]">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
