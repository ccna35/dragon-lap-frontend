'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { Laptop, CartItemWithLaptop } from '@/types/api';
import { formatEGP } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import {
  ShoppingCart,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  Star,
  ShieldCheck,
  RotateCcw,
  Package,
  Cpu,
  Monitor,
  MemoryStick,
  HardDrive,
  Gamepad2,
  Settings,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';

export default function LaptopDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: laptop, isLoading, error } = useQuery({
    queryKey: ['laptop', id],
    queryFn: async () => {
      const res = await api.get<Laptop>(`/laptops/${id}`);
      return res.data;
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        router.push(`/auth/login?callbackUrl=/laptops/${id}`);
        return;
      }
      return api.post<CartItemWithLaptop>('/cart/items', { laptopId: id, quantity });
    },
    onSuccess: () => {
      setAdded(true);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setTimeout(() => setAdded(false), 3000);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#0057D9]" />
      </div>
    );
  }

  if (error || !laptop) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-[#E5E7EB]" />
        <h2 className="text-lg font-semibold text-[#111113]">Product not found</h2>
        <p className="mt-2 text-sm text-[#6B7280]">This product may have been removed or is temporarily unavailable.</p>
        <Link href="/laptops" className="btn-secondary mt-6">
          Back to catalog
        </Link>
      </div>
    );
  }

  const specs = [
    { label: 'Processor', value: laptop.cpu, icon: Cpu },
    { label: 'Graphics', value: laptop.gpu, icon: Gamepad2 },
    { label: 'Memory', value: laptop.ram, icon: MemoryStick },
    { label: 'Storage', value: laptop.storage, icon: HardDrive },
    { label: 'Display', value: laptop.screenSize, icon: Monitor },
    { label: 'OS', value: laptop.os, icon: Settings },
  ].filter(s => s.value);

  const inStock = laptop.stock > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:px-6">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#111113] transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/laptops" className="hover:text-[#111113] transition-colors">Laptops</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1 text-[#374151]">{laptop.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left: Image */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-8 lg:p-12">
              {laptop.imageUrl ? (
                <img
                  src={laptop.imageUrl}
                  alt={laptop.title}
                  className="mx-auto h-80 w-full object-contain transition-transform duration-500 hover:scale-103"
                />
              ) : (
                <div className="flex h-80 items-center justify-center">
                  <svg viewBox="0 0 80 60" className="h-20 w-20 text-[#D1D5DB]" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="4" width="72" height="46" rx="4" />
                    <path d="M0 56h80M24 50h32" />
                  </svg>
                </div>
              )}
            </div>

            {/* Trust signals under image */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: '2-Year warranty' },
                { icon: RotateCcw, label: '14-day returns' },
                { icon: Package, label: 'Free shipping' },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-1.5 rounded-lg border border-[#E5E7EB] p-3 text-center">
                  <t.icon className="h-4 w-4 text-[#0057D9]" />
                  <p className="text-xs text-[#6B7280]">{t.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div>
            {/* Brand + rating */}
            <div className="mb-3 flex items-center gap-3">
              <span className="badge badge-blue">{laptop.brand}</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-xs text-[#6B7280]">(4.9)</span>
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold leading-snug tracking-tight text-[#111113] md:text-3xl">
              {laptop.title}
            </h1>
            <p className="mb-6 text-sm text-[#9CA3AF]">Model: {laptop.model}</p>

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#111113]">{formatEGP(laptop.price)}</span>
            </div>

            {/* Short description */}
            {laptop.shortDescription && (
              <p className="mb-6 text-sm leading-relaxed text-[#6B7280] border-l-2 border-[#E5E7EB] pl-4">
                {laptop.shortDescription}
              </p>
            )}

            {/* Stock status */}
            <div className="mb-6 flex items-center gap-2">
              {inStock ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    In stock{laptop.stock <= 5 ? ` — only ${laptop.stock} left` : ''}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-[#9CA3AF]" />
                  <span className="text-sm text-[#6B7280]">Out of stock</span>
                </>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 items-center rounded-md border border-[#E5E7EB]">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-full w-10 items-center justify-center text-[#6B7280] hover:text-[#111113] transition-colors disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-[#111113]">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(laptop.stock, q + 1))}
                  disabled={quantity >= laptop.stock}
                  className="flex h-full w-10 items-center justify-center text-[#6B7280] hover:text-[#111113] transition-colors disabled:opacity-30"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                onClick={() => addToCartMutation.mutate()}
                disabled={!inStock || addToCartMutation.isPending}
                className="btn-primary flex flex-1 items-center justify-center gap-2 py-3"
              >
                {addToCartMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : added ? (
                  <><CheckCircle className="h-4 w-4" /> Added to cart</>
                ) : (
                  <><ShoppingCart className="h-4 w-4" /> {inStock ? 'Add to cart' : 'Out of stock'}</>
                )}
              </button>
            </div>

            {/* Success message */}
            {added && (
              <div className="mb-6 flex items-center gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Added to your cart. <Link href="/cart" className="font-semibold underline">View cart</Link></span>
              </div>
            )}

            {/* Specs table */}
            {specs.length > 0 && (
              <div className="border-t border-[#E5E7EB] pt-6">
                <h3 className="mb-4 text-sm font-semibold text-[#111113]">Specifications</h3>
                <div className="space-y-3">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-start gap-3 text-sm">
                      <spec.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#0057D9]" />
                      <span className="w-20 shrink-0 text-[#9CA3AF]">{spec.label}</span>
                      <span className="font-medium text-[#374151]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full description */}
        {laptop.description && (
          <div className="mt-12 border-t border-[#E5E7EB] pt-10">
            <h2 className="mb-4 text-lg font-semibold text-[#111113]">About this laptop</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[#6B7280]">{laptop.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
