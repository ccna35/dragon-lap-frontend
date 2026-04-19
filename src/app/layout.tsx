import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import Navbar from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dragon Lap — Laptops & PCs in Egypt",
  description: "Shop the best laptops in Egypt. Competitive prices, genuine products, free shipping, and 2-year warranty on all items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "min-h-screen font-sans antialiased bg-white text-[#111113]")}>
        <QueryProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-[#E5E7EB] bg-white">
                <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
                    {/* Brand */}
                    <div className="md:col-span-2">
                      <Link href="/" className="flex items-center gap-0.5">
                        <span className="text-lg font-black tracking-tight text-[#111113]">Dragon</span>
                        <span className="text-lg font-black tracking-tight text-[#0057D9]">Lap</span>
                      </Link>
                      <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#6B7280]">
                        Egypt's leading online retailer for laptops and portable computing. Genuine products, competitive prices.
                      </p>
                      <div className="mt-6 flex items-center gap-2">
                        <span className="badge badge-green">● Live support</span>
                      </div>
                    </div>

                    {/* Shop */}
                    <div>
                      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Shop</p>
                      <ul className="space-y-3 text-sm text-[#374151]">
                        <li><Link href="/laptops" className="hover:text-[#0057D9] transition-colors">All Laptops</Link></li>
                        <li><Link href="/laptops?category=gaming" className="hover:text-[#0057D9] transition-colors">Gaming</Link></li>
                        <li><Link href="/laptops?category=professional" className="hover:text-[#0057D9] transition-colors">Professional</Link></li>
                        <li><Link href="/laptops?category=ultrabook" className="hover:text-[#0057D9] transition-colors">Ultrabooks</Link></li>
                      </ul>
                    </div>

                    {/* Brands */}
                    <div>
                      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Top Brands</p>
                      <ul className="space-y-3 text-sm text-[#374151]">
                        {['ASUS', 'Lenovo', 'Dell', 'HP', 'MSI'].map(b => (
                          <li key={b}><Link href={`/laptops?brand=${b}`} className="hover:text-[#0057D9] transition-colors">{b}</Link></li>
                        ))}
                      </ul>
                    </div>

                    {/* Support */}
                    <div>
                      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Support</p>
                      <ul className="space-y-3 text-sm text-[#374151]">
                        <li><Link href="/account" className="hover:text-[#0057D9] transition-colors">My Account</Link></li>
                        <li><Link href="/orders" className="hover:text-[#0057D9] transition-colors">Order History</Link></li>
                        <li><Link href="/cart" className="hover:text-[#0057D9] transition-colors">Cart</Link></li>
                        <li><Link href="/auth/register" className="hover:text-[#0057D9] transition-colors">Create Account</Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#E5E7EB] pt-8 sm:flex-row">
                    <p className="text-xs text-[#9CA3AF]">
                      © {new Date().getFullYear()} DragonLap. All rights reserved.
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      Genuine products · Secure checkout · Fast delivery
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
