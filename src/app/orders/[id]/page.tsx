'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { OrderWithItems } from '@/types/api';
import { formatEGP, formatDate, cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, CheckCircle, Package, Truck, X, ChevronRight, Loader2, MapPin, Phone, User, CreditCard, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING:          { label: 'Pending',          icon: Clock,        cls: 'bg-amber-50 text-amber-700 border-amber-200',     step: 0 },
  CONFIRMED:        { label: 'Confirmed',         icon: CheckCircle,  cls: 'bg-blue-50 text-[#0057D9] border-blue-200',       step: 1 },
  PREPARING:        { label: 'Preparing',         icon: Package,      cls: 'bg-indigo-50 text-indigo-700 border-indigo-200',  step: 2 },
  OUT_FOR_DELIVERY: { label: 'Out for delivery',  icon: Truck,        cls: 'bg-orange-50 text-orange-700 border-orange-200',  step: 3 },
  DELIVERED:        { label: 'Delivered',         icon: CheckCircle,  cls: 'bg-green-50 text-green-700 border-green-200',     step: 4 },
  CANCELLED:        { label: 'Cancelled',         icon: X,            cls: 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]',   step: -1 },
} as const;

const STEPS = ['Confirmed', 'Preparing', 'Out for delivery', 'Delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await api.get<OrderWithItems>(`/orders/my/${id}`);
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

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-[#E5E7EB]" />
        <h2 className="text-base font-semibold text-[#111113]">Order not found</h2>
        <Link href="/orders" className="btn-secondary mt-4">Back to orders</Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = cfg.icon;
  const currentStep = cfg.step;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:px-6">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#111113]">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/orders" className="hover:text-[#111113]">My orders</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#374151]">#{order.id.slice(0, 8).toUpperCase()}</span>
        </nav>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111113]">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-[#9CA3AF]">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${cfg.cls} self-start sm:self-auto`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {cfg.label}
          </span>
        </div>

        {/* Tracker — only show for non-cancelled orders */}
        {order.status !== 'CANCELLED' && (
          <div className="mb-8 rounded-xl border border-[#E5E7EB] bg-white p-6">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-0">
              {STEPS.map((step, i) => {
                const done = currentStep > i + 1;
                const active = currentStep === i + 1;
                const Icon = i === 0 ? Clock : i === 1 ? Package : i === 2 ? Truck : CheckCircle;

                return (
                  <div key={step} className="relative flex flex-1 flex-row items-center gap-4 md:flex-col md:gap-0">
                    {/* Line Connector (Vertical on mobile, Horizontal on desktop) */}
                    {i < STEPS.length - 1 && (
                      <>
                        {/* Desktop line */}
                        <div 
                          className={cn(
                            "absolute left-1/2 top-4 hidden h-[2px] w-full -translate-y-1/2 md:block",
                            currentStep > i + 1 ? "bg-[#0057D9]" : "bg-[#F3F4F6]"
                          )} 
                        />
                        {/* Mobile line */}
                        <div 
                          className={cn(
                            "absolute left-4 top-8 h-8 w-[2px] -translate-x-1/2 md:hidden",
                            currentStep > i + 1 ? "bg-[#0057D9]" : "bg-[#F3F4F6]"
                          )} 
                        />
                      </>
                    )}
                    
                    {/* Circle / Icon */}
                    <div className={cn(
                      "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                      done || active 
                        ? "border-[#0057D9] bg-[#0057D9] text-white" 
                        : "border-[#E5E7EB] bg-white text-[#9CA3AF]"
                    )}>
                      {done ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    
                    {/* Label */}
                    <div className="text-left md:mt-3 md:text-center">
                      <p className={cn(
                        "text-[11px] font-bold uppercase tracking-wider",
                        active ? "text-[#0057D9]" : "text-[#9CA3AF]"
                      )}>
                        {step}
                      </p>
                      {active && (
                        <span className="mt-0.5 block text-[10px] font-medium text-[#6B7280]">
                          Current Status
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Items */}
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-xl border border-[#E5E7EB]">
              <div className="border-b border-[#E5E7EB] px-5 py-4">
                <h2 className="text-sm font-semibold text-[#111113]">Items ordered</h2>
              </div>
              <div className="divide-y divide-[#F3F4F6] p-5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-xs font-semibold text-[#6B7280]">
                        ×{item.quantity}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111113]">{item.laptopTitleSnapshot}</p>
                        <p className="text-xs text-[#9CA3AF]">{formatEGP(item.unitPriceSnapshot)} each</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#111113] whitespace-nowrap">{formatEGP(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery info */}
            <div className="rounded-xl border border-[#E5E7EB] p-5">
              <h2 className="mb-4 text-sm font-semibold text-[#111113]">Delivery details</h2>
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="flex items-start gap-2.5 text-[#374151]">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-[#0057D9]" />
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Recipient</p>
                    <p className="font-medium">{order.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-[#374151]">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#0057D9]" />
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Phone</p>
                    <p className="font-medium">{order.phone}</p>
                    {order.alternatePhone && <p className="text-[#9CA3AF]">{order.alternatePhone}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-[#374151] sm:col-span-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0057D9]" />
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Address</p>
                    <p className="font-medium">{order.streetAddress}, {order.area}, {order.city}</p>
                  </div>
                </div>
                {order.notes && (
                  <div className="rounded-md bg-[#F9FAFB] p-3 text-xs text-[#6B7280] sm:col-span-2">
                    <p className="font-medium text-[#374151]">Delivery note:</p>
                    <p className="mt-1">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="rounded-xl border border-[#E5E7EB] p-5 self-start">
            <h2 className="mb-4 text-sm font-semibold text-[#111113]">Order summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#374151]">
                <span>Subtotal</span>
                <span className="font-medium">{formatEGP(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#374151]">
                <span>Shipping</span>
                <span className="font-medium text-green-600">{Number(order.shippingFee) === 0 ? 'Free' : formatEGP(order.shippingFee)}</span>
              </div>
            </div>
            <div className="my-4 border-t border-[#E5E7EB]" />
            <div className="mb-5 flex justify-between">
              <span className="font-semibold text-[#111113]">Total</span>
              <span className="text-base font-bold text-[#111113]">{formatEGP(order.total)}</span>
            </div>

            <div className="flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-xs text-[#6B7280]">
              <CreditCard className="h-3.5 w-3.5 text-[#0057D9]" />
              <span>Payment: {order.paymentMethod || 'Cash on Delivery'}</span>
            </div>

            <Link href="/orders" className="btn-secondary mt-4 w-full justify-center text-sm">
              ← Back to orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
