'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { Laptop } from '@/types/api';
import { formatEGP } from '@/lib/utils';
import Link from 'next/link';
import { Plus, Edit, Trash, Search, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdminLaptopsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: laptops, isLoading } = useQuery({
    queryKey: ['admin-laptops'],
    queryFn: async () => {
      const res = await api.get<Laptop[]>('/admin/laptops');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/laptops/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-laptops'] });
      setDeleteId(null);
    },
  });

  const filtered = laptops?.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8 md:px-6">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111113]">Products</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              {laptops?.length ?? 0} total products
            </p>
          </div>
          <Link href="/admin/laptops/new" className="btn-primary self-start sm:self-auto">
            <Plus className="h-4 w-4" /> Add product
          </Link>
        </div>

        {/* Search */}
        <div className="mb-5 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search products..."
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
                  <th className="py-3.5 pl-5 pr-3 text-left text-xs font-semibold text-[#6B7280]">Product</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#111113] hidden sm:table-cell uppercase tracking-wider">Brand</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#111113] hidden sm:table-cell uppercase tracking-wider">Category</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#111113] uppercase tracking-wider">Price</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#6B7280] hidden md:table-cell">Stock</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-[#6B7280] hidden md:table-cell">Status</th>
                  <th className="relative py-3.5 pl-3 pr-5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9FAFB]">
                {filtered?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-[#9CA3AF]">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filtered?.map((laptop) => (
                    <tr key={laptop.id} className="hover:bg-[#FAFAFA] transition-colors group">
                      <td className="py-4 pl-5 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-1">
                            {laptop.featuredImage?.url ? (
                              <img src={laptop.featuredImage.url} alt="" className="h-full w-full object-contain" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <svg viewBox="0 0 40 30" className="h-5 w-5 text-[#E5E7EB]" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <rect x="2" y="2" width="36" height="22" rx="2" />
                                  <path d="M0 28h40M12 25h16" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#111113] max-w-[200px]">{laptop.title}</p>
                            <p className="text-xs text-[#9CA3AF]">{laptop.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-[#374151] hidden sm:table-cell">{laptop.brand}</td>
                      <td className="px-3 py-4 text-sm text-[#6B7280] hidden sm:table-cell">
                        {laptop.category?.name || <span className="text-[#9CA3AF] italic text-[11px]">Uncategorized</span>}
                      </td>
                      <td className="px-3 py-4 text-sm font-medium text-[#111113]">{formatEGP(laptop.price)}</td>
                      <td className="px-3 py-4 hidden md:table-cell">
                        <span className={`text-sm font-medium ${laptop.stock === 0 ? 'text-red-600' : laptop.stock <= 3 ? 'text-amber-600' : 'text-[#374151]'}`}>
                          {laptop.stock} units
                        </span>
                      </td>
                      <td className="px-3 py-4 hidden md:table-cell">
                        {laptop.isPublished ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 border border-green-200">
                            <Eye className="h-3 w-3" /> Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F9FAFB] px-2.5 py-0.5 text-xs font-medium text-[#6B7280] border border-[#E5E7EB]">
                            <EyeOff className="h-3 w-3" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="py-4 pl-3 pr-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/laptops/${laptop.id}/edit`}
                            className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#374151] transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(laptop.id)}
                            className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-[#111113]">Delete product?</h3>
            <p className="mt-2 text-sm text-[#6B7280]">This action cannot be undone. The product will be permanently removed.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary py-2 text-sm">Cancel</button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
