'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { OrderWithItems, CartItemWithLaptop } from '@/types/api';
import { formatEGP } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, ChevronRight, ShieldCheck, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';

const schema = z.object({
  fullName: z.string().min(3, 'Full name required'),
  phone: z.string().min(11, 'Valid phone number required'),
  alternatePhone: z.string().optional(),
  city: z.string().min(2, 'City required'),
  area: z.string().min(2, 'Area required'),
  streetAddress: z.string().min(5, 'Street address required'),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] p-6">
      <h3 className="mb-5 text-sm font-semibold text-[#111113]">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart', !!user],
    queryFn: async () => {
      const endpoint = user ? '/cart' : '/cart/guest';
      const res = await api.get<CartItemWithLaptop[]>(endpoint);
      return res.data;
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        phone: user.phone ?? '',
      });
    }
  }, [user, reset]);

  const placeOrder = useMutation({
    mutationFn: (data: FormValues) => {
      const endpoint = user ? '/orders' : '/orders/guest';
      return api.post<OrderWithItems>(endpoint, data);
    },
    onSuccess: (res) => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // Only redirect logged in users to their order history
      if (user) {
        setTimeout(() => router.push(`/orders/${res.data.id}`), 2500);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0057D9]" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-[#111113]">Order placed!</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          {user 
            ? "Redirecting you to your order details..." 
            : "Thank you for your order! Our team will contact you soon."}
        </p>
        {user && <Loader2 className="mt-6 h-5 w-5 animate-spin text-[#0057D9]" />}
        {!user && (
          <Link href="/laptops" className="btn-primary mt-8">
            Continue shopping
          </Link>
        )}
      </div>
    );
  }

  const subtotal = cartItems?.reduce((a, i) => a + parseFloat(i.laptop.price) * i.quantity, 0) ?? 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:px-6">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#111113]">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/cart" className="hover:text-[#111113]">Cart</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#374151]">Checkout</span>
        </nav>

        <h1 className="mb-8 text-2xl font-bold tracking-tight text-[#111113]">Checkout</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <form
            onSubmit={handleSubmit((d) => placeOrder.mutate(d))}
            className="space-y-5 lg:col-span-2"
          >
            <FormSection title="Contact information">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.fullName?.message}>
                  <input {...register('fullName')} className={`input-field ${errors.fullName ? 'border-red-400' : ''}`} placeholder="John Doe" />
                </Field>
                <Field label="Phone number" error={errors.phone?.message}>
                  <input {...register('phone')} className={`input-field ${errors.phone ? 'border-red-400' : ''}`} placeholder="010XXXXXXXX" type="tel" />
                </Field>
                <Field label="Alternate phone (optional)">
                  <input {...register('alternatePhone')} className="input-field" placeholder="011XXXXXXXX" type="tel" />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Delivery address">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="City" error={errors.city?.message}>
                  <input {...register('city')} className={`input-field ${errors.city ? 'border-red-400' : ''}`} placeholder="Cairo" />
                </Field>
                <Field label="Area / District" error={errors.area?.message}>
                  <input {...register('area')} className={`input-field ${errors.area ? 'border-red-400' : ''}`} placeholder="Nasr City" />
                </Field>
              </div>
              <Field label="Street address" error={errors.streetAddress?.message}>
                <input {...register('streetAddress')} className={`input-field ${errors.streetAddress ? 'border-red-400' : ''}`} placeholder="Building 5, Floor 2, Apt 10, Street 15" />
              </Field>
              <Field label="Delivery notes (optional)">
                <textarea {...register('notes')} className="input-field min-h-[80px] resize-none" placeholder="Any special instructions for the courier..." />
              </Field>
            </FormSection>

            <FormSection title="Payment method">
              <div className="flex items-center gap-3 rounded-lg border border-[#0057D9] bg-[#EEF4FF] p-4">
                <CreditCard className="h-5 w-5 text-[#0057D9]" />
                <div>
                  <p className="text-sm font-semibold text-[#111113]">Cash on Delivery</p>
                  <p className="text-xs text-[#6B7280]">Pay when your order arrives. No card required.</p>
                </div>
                <div className="ml-auto h-4 w-4 rounded-full border-4 border-[#0057D9]" />
              </div>
            </FormSection>

            {/* Submit in sidebar on mobile */}
            <button
              type="submit"
              disabled={placeOrder.isPending}
              className="btn-primary w-full justify-center py-3.5 lg:hidden"
            >
              {placeOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : `Place order — ${formatEGP(subtotal)}`}
            </button>
          </form>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="mb-5 text-sm font-semibold text-[#111113]">
                Order summary ({cartItems?.length ?? 0} items)
              </h2>

              <div className="mb-5 max-h-64 space-y-3 overflow-y-auto">
                {cartItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-1">
                      {item.laptop.featuredImage?.url ? (
                        <img src={item.laptop.featuredImage.url} alt={item.laptop.title} className="h-full w-full object-contain" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#9CA3AF]">IMG</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1 text-xs font-medium text-[#374151]">{item.laptop.title}</p>
                      <p className="text-xs text-[#9CA3AF]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#111113] whitespace-nowrap">
                      {formatEGP(parseFloat(item.laptop.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-[#E5E7EB] pt-4 text-sm">
                <div className="flex justify-between text-[#374151]">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatEGP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#374151]">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <div className="my-4 border-t border-[#E5E7EB]" />

              <div className="mb-5 flex justify-between">
                <span className="font-semibold text-[#111113]">Total</span>
                <span className="text-lg font-bold text-[#111113]">{formatEGP(subtotal)}</span>
              </div>

              <button
                onClick={handleSubmit((d) => placeOrder.mutate(d))}
                disabled={placeOrder.isPending}
                className="btn-primary hidden w-full justify-center py-3.5 lg:flex"
              >
                {placeOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Place order'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#9CA3AF]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
