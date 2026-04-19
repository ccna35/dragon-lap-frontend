import Link from 'next/link';
import { Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#F3F4F6] text-[#9CA3AF]">
        <Search className="h-10 w-10" />
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight text-[#111113] sm:text-5xl">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-[#374151]">Page not found</h2>
      
      <p className="mx-auto mt-4 max-w-sm text-[#6B7280]">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist anymore.
      </p>
      
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/" className="btn-primary w-full px-8 py-3.5 sm:w-auto">
          <Home className="h-4 w-4" /> Go back home
        </Link>
        <Link href="/laptops" className="btn-secondary w-full px-8 py-3.5 sm:w-auto">
          Shop laptops
        </Link>
      </div>
      
      <div className="mt-16 text-sm text-[#9CA3AF]">
        If you believe this is an error, please contact our support team.
      </div>
    </div>
  );
}
