'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { UserPublic } from '@/types/api';
import { UserPlus, Mail, Lock, User, Phone, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(11, 'Enter a valid phone number').max(15).optional(),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post<{ user: UserPublic }>('/auth/register', data);
      queryClient.setQueryData(['me'], res.data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-[#F9FAFB] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-0.5 mb-8">
            <span className="text-lg font-black tracking-tight text-[#111113]">Dragon</span>
            <span className="text-lg font-black tracking-tight text-[#0057D9]">Lap</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#111113]">Create your account</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-[#0057D9] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2.5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="fullName">Full name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                {...register('fullName')}
                id="fullName"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                className={`input-field pl-10 ${errors.fullName ? 'border-red-400' : ''}`}
              />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="email">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="phone">Phone number <span className="font-normal text-[#9CA3AF]">(optional)</span></label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                {...register('phone')}
                id="phone"
                type="tel"
                placeholder="010XXXXXXXX"
                autoComplete="tel"
                className={`input-field pl-10 ${errors.phone ? 'border-red-400' : ''}`}
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center py-3 mt-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#9CA3AF]">
          By creating an account, you agree to our{' '}
          <Link href="#" className="underline hover:text-[#374151]">Terms</Link> and{' '}
          <Link href="#" className="underline hover:text-[#374151]">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
