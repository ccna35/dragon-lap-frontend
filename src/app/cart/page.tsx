'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { CartItemWithLaptop } from '@/types/api';
import { formatEGP } from '@/lib/utils';
import Link from 'next/link';
import { Trash, Plus, Minus, ArrowRight, ShoppingCart, Loader2, AlertCircle, ChevronRight } from 'lucide-react';

export default function CartPage() {
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get<CartItemWithLaptop[]>('/cart');
      return res.data;
    },
  });

  const updateQtyMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      api.patch<CartItemWithLaptop>(`/cart/items/${id}`, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/cart/items/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0057D9]" />
      </div>
    );
  }

  const subtotal = cartItems?.reduce((acc, item) =>
    acc + parseFloat(item.laptop.price) * item.quantity, 0) ?? 0;

  const isEmpty = !cartItems || cartItems.length === 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:px-6">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#111113] transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#374151]">Cart</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#111113]">
            Shopping cart {!isEmpty && <span className="text-[#9CA3AF]">({cartItems!.length})</span>}
          </h1>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E7EB] py-24 text-center">
            <ShoppingCart className="mb-4 h-10 w-10 text-[#E5E7EB]" />
            <h2 className="text-base font-semibold text-[#111113]">Your cart is empty</h2>
            <p className="mt-2 text-sm text-[#6B7280]">Browse our catalog to find your next laptop.</p>
            <Link href="/laptops" className="btn-primary mt-6">
              Shop now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems!.map((item) => (
                <div key={item.id} className="flex gap-5 rounded-xl border border-[#E5E7EB] p-4">
                  {/* Image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-2">
                    {item.laptop.featuredImage?.url ? (
                      <img src={item.laptop.featuredImage.url} alt={item.laptop.title} className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-[#D1D5DB]" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#0057D9]">{item.laptop.brand}</p>
                        <Link href={`/laptops/${item.laptop.slug}`} className="text-sm font-semibold text-[#111113] hover:text-[#0057D9] transition-colors line-clamp-2 leading-snug">
                          {item.laptop.title}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeMutation.mutate(item.id)}
                        className="shrink-0 rounded-md p-1.5 text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Qty */}
                      <div className="flex h-8 items-center rounded-md border border-[#E5E7EB]">
                        <button
                          onClick={() => updateQtyMutation.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                          disabled={item.quantity <= 1 || updateQtyMutation.isPending}
                          className="flex h-full w-8 items-center justify-center text-[#6B7280] hover:text-[#111113] disabled:opacity-30 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-[#111113]">{item.quantity}</span>
                        <button
                          onClick={() => updateQtyMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                          disabled={item.quantity >= item.laptop.stock || updateQtyMutation.isPending}
                          className="flex h-full w-8 items-center justify-center text-[#6B7280] hover:text-[#111113] disabled:opacity-30 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#111113]">
                        {formatEGP(parseFloat(item.laptop.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-[#E5E7EB] p-6">
                <h2 className="mb-5 text-base font-semibold text-[#111113]">Order summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#374151]">
                    <span>Subtotal ({cartItems!.length} {cartItems!.length === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">{formatEGP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#374151]">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>

                <div className="my-5 border-t border-[#E5E7EB]" />

                <div className="mb-5 flex justify-between">
                  <span className="font-semibold text-[#111113]">Total</span>
                  <span className="text-lg font-bold text-[#111113]">{formatEGP(subtotal)}</span>
                </div>

                <Link href="/checkout" className="btn-primary w-full justify-center">
                  Proceed to checkout <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="mt-4 flex items-start gap-2 rounded-md bg-[#F9FAFB] p-3 text-xs text-[#6B7280]">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0057D9]" />
                  <span>Cash on delivery. Pay when you receive your order.</span>
                </div>

                <div className="mt-4 text-center">
                  <Link href="/laptops" className="text-xs text-[#0057D9] hover:underline">
                    ← Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
