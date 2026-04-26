'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { CartItemWithLaptop } from '@/types/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isAdmin = user?.role === 'ADMIN';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: cartItems } = useQuery({
    queryKey: ['cart', !!user],
    queryFn: async () => {
      const endpoint = user ? '/cart' : '/cart/guest';
      const res = await api.get<CartItemWithLaptop[]>(endpoint);
      return res.data;
    },
  });

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#0057D9] py-2 text-center text-xs font-medium text-white">
        Free nationwide shipping on all orders ·
        <Link href="/laptops" className="ml-1 underline underline-offset-2 hover:no-underline">
          Shop now →
        </Link>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-white transition-shadow duration-200',
          scrolled ? 'shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'border-b border-[#E5E7EB]'
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 group">
            <span className="text-lg font-black tracking-tight text-[#111113]">Dragon</span>
            <span className="text-lg font-black tracking-tight text-[#0057D9]">Lap</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/laptops"
              className={cn('nav-link', pathname.startsWith('/laptops') && 'nav-link-active')}
            >
              Shop
            </Link>
            <Link href="/laptops?brand=Gaming" className="nav-link">
              Gaming
            </Link>
            <Link href="/laptops?brand=Business" className="nav-link">
              Business
            </Link>
            <Link href="/laptops?sort=new" className="nav-link">
              New Arrivals
            </Link>
            {isAdmin && (
              <div className="flex items-center gap-6 border-l border-[#E5E7EB] pl-6">
                <Link
                  href="/admin"
                  className={cn('nav-link text-xs', pathname.startsWith('/admin') && 'nav-link-active')}
                >
                  Admin
                </Link>
              </div>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-[#374151] transition-colors hover:bg-[#F9FAFB] hover:text-[#0057D9]"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0057D9] text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in duration-300">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="hidden items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB] md:flex"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0057D9] text-xs font-bold text-white">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.fullName.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="hidden h-9 w-9 items-center justify-center rounded-md text-[#9CA3AF] transition-colors hover:bg-[#FEF2F2] hover:text-red-500 md:flex"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Link href="/auth/login" className="text-sm font-medium text-[#374151] hover:text-[#111113]">
                  Sign in
                </Link>
                <Link href="/auth/register" className="btn-primary py-2 text-xs">
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-[#374151] hover:bg-[#F9FAFB] md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t border-[#E5E7EB] bg-white md:hidden">
            <div className="container mx-auto space-y-1 px-4 py-4">
              {[
                { href: '/laptops', label: 'Shop All' },
                { href: '/laptops?brand=Gaming', label: 'Gaming' },
                { href: '/laptops?brand=Business', label: 'Business' },
                { href: '/laptops?sort=new', label: 'New Arrivals' },
                ...(user ? [{ href: '/orders', label: 'My Orders' }] : []),
                ...(isAdmin ? [{ href: '/admin/laptops', label: 'Admin — Products' }] : []),
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 border-t border-[#E5E7EB] pt-4">
                {user ? (
                  <button
                    onClick={() => logout()}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-[#FEF2F2]"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/auth/login" className="btn-secondary w-full justify-center" onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Link>
                    <Link href="/auth/register" className="btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
