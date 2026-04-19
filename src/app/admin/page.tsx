'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { AdminStats } from '@/types/api';
import { formatEGP } from '@/lib/utils';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Loader2,
  Calendar,
  Clock,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get<AdminStats>('/admin/stats');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0057D9]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <h2 className="mt-4 text-lg font-bold text-red-900">Failed to load statistics</h2>
          <p className="mt-2 text-sm text-red-700">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Revenue',
      value: formatEGP(stats?.totalRevenue || '0'),
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      trend: '+12.5%',
    },
    {
      label: 'Total Orders',
      value: stats?.ordersCount || 0,
      icon: ShoppingBag,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      trend: '+8.2%',
    },
    {
      label: 'Active Customers',
      value: stats?.customersCount || 0,
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      trend: '+2.4%',
    },
    {
      label: 'Low Stock Items',
      value: stats?.lowStockCount || 0,
      icon: AlertCircle,
      color: stats?.lowStockCount && stats.lowStockCount > 0 ? 'text-amber-500' : 'text-slate-400',
      bg: stats?.lowStockCount && stats.lowStockCount > 0 ? 'bg-amber-50' : 'bg-slate-50',
      trend: 'Needs attention',
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#111113]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Store performance and overview at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/laptops/new" className="btn-primary flex items-center gap-2 px-6 py-2.5 text-xs">
            <Plus className="h-4 w-4" /> Add Laptop
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", kpi.bg)}>
                <kpi.icon className={cn("h-6 w-6", kpi.color)} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                {kpi.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-[#6B7280]">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-[#111113]">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Sales Overview & Recent Orders */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sales Placeholder Chart */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-[#111113]">Sales Performance</h3>
              <div className="flex items-center gap-2 rounded-lg bg-[#F9FAFB] p-1">
                {['7D', '30D', '1Y'].map((range) => (
                  <button
                    key={range}
                    className={cn(
                      "rounded-md px-3 py-1 text-[10px] font-bold uppercase transition-colors",
                      range === '7D' ? "bg-white text-[#0057D9] shadow-sm" : "text-[#9CA3AF] hover:text-[#111113]"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-[240px] w-full bg-[#FAFBFF] rounded-xl flex items-end justify-between px-4 pb-4">
              {/* Simple Mock Bar Chart */}
              {[40, 60, 45, 90, 65, 80, 55].map((height, i) => (
                <div key={i} className="group relative w-[10%]">
                  <div
                    className="w-full rounded-t-md bg-[#0057D9]/10 transition-colors group-hover:bg-[#0057D9]/20"
                    style={{ height: `${height}%` }}
                  >
                    <div
                      className="absolute bottom-0 w-full rounded-t-md bg-[#0057D9] transition-all"
                      style={{ height: `${height * 0.7}%` }}
                    />
                  </div>
                  <span className="mt-2 block text-center text-[9px] font-medium text-[#9CA3AF]">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F9FAFB]/50 p-6">
              <h3 className="font-bold text-[#111113]">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs font-bold text-[#0057D9] hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {(stats?.recentOrders || []).map((order) => (
                    <tr key={order.id} className="group hover:bg-[#F9FAFB]/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="text-xs font-mono font-medium text-[#374151]">
                          #{order.id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-[#111113]">{order.user.fullName}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{order.city}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border",
                          order.status === 'DELIVERED' ? "bg-green-50 text-green-700 border-green-100" :
                            order.status === 'CANCELLED' ? "bg-red-50 text-red-700 border-red-100" :
                              "bg-blue-50 text-[#0057D9] border-blue-100"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-xs font-bold text-[#111113]">
                        {formatEGP(order.total)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-[#EEF4FF] hover:text-[#0057D9]"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {!stats?.recentOrders?.length && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm text-[#9CA3AF]">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Stats & Activity */}
        <div className="space-y-8">
          {/* Inventory Health */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-[#111113]">Inventory Health</h3>
              <Link href="/admin/laptops" className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#0057D9]">
                Full List
              </Link>
            </div>

            <div className="space-y-4">
              {stats?.lowStockCount && stats.lowStockCount > 0 ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">{stats.lowStockCount} Items Low in Stock</p>
                      <p className="mt-1 text-[10px] text-amber-700 leading-relaxed">
                        Several laptops have fallen below the threshold. Consider restock soon.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-xs font-bold text-green-900">Inventory Optimal</p>
                      <p className="mt-1 text-[10px] text-green-700 leading-relaxed">
                        All published products have healthy stock levels.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <h3 className="mb-6 font-bold text-[#111113]">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Manage Products', href: '/admin/laptops', icon: Package },
                { label: 'Review Orders', href: '/admin/orders', icon: ShoppingBag },
                { label: 'Customer Base', href: '/admin/users', icon: Users },
                { label: 'Platform Settings', href: '#', icon: ArrowUpRight },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center justify-center rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] p-4 text-center transition-all hover:border-[#0057D9]/20 hover:bg-[#EEF4FF] hover:-translate-y-0.5"
                >
                  <action.icon className="mb-2 h-5 w-5 text-[#374151]" />
                  <span className="text-[10px] font-bold text-[#111113]">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
