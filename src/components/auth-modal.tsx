'use client';

import React, { useEffect } from 'react';
import { LogIn, UserPlus, X, ShoppingBag, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  callbackUrl?: string;
}

export default function AuthModal({ isOpen, onClose, callbackUrl }: AuthModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with premium blur */}
      <div 
        className="absolute inset-0 bg-[#111113]/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Top Header/Icon */}
        <div className="flex flex-col items-center border-b border-[#F3F4F6] bg-[#F9FAFB] p-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#E5E7EB]">
            <ShieldAlert className="h-7 w-7 text-[#0057D9]" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#111113]">Authentication Required</h3>
          <p className="mt-2 text-sm text-[#6B7280]">
            Please sign in to your Dragon Lap account to manage your cart and complete your purchase.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="space-y-3 p-6">
          <Link
            href={`/auth/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0057D9] py-3 text-sm font-semibold text-white transition-all hover:bg-[#0047B3] hover:shadow-lg active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            Login to your account
          </Link>
          
          <Link
            href={`/auth/register${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#111113] transition-all hover:bg-[#F9FAFB] hover:border-[#D1D5DB] active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" />
            Create new account
          </Link>

          <button
            onClick={onClose}
            className="mt-2 w-full text-center text-xs font-medium text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
          >
            Continue browsing as guest
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111113] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
