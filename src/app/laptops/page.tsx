'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { Laptop, Category } from '@/types/api';
import { formatEGP, cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronRight, Loader2, X } from 'lucide-react';
import { useState, Suspense } from 'react';

function ProductCard({ laptop }: { laptop: Laptop }) {
  return (
    <Link href={`/laptops/${laptop.slug}`} className="product-card group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F9FAFB] p-5">
        {laptop.stock === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <span className="rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#6B7280]">
              Out of stock
            </span>
          </div>
        )}
        {laptop.stock > 0 && laptop.stock <= 3 && (
          <span className="badge absolute left-3 top-3 z-10 bg-[#FFF7ED] text-orange-600">
            Only {laptop.stock} left
          </span>
        )}
        {laptop.featuredImage?.url ? (
          <img
            src={laptop.featuredImage.url}
            alt={laptop.title}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg viewBox="0 0 80 60" className="h-16 w-16 text-[#D1D5DB]" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="4" width="72" height="46" rx="4" />
              <path d="M0 56h80M24 50h32" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0057D9]">{laptop.brand}</p>
          {laptop.category && (
            <span className="text-[10px] font-medium text-[#6B7280] bg-[#F3F4F6] px-1.5 py-0.5 rounded">
              {laptop.category.name}
            </span>
          )}
        </div>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-[#111113] group-hover:text-[#0057D9] transition-colors min-h-[2.5rem]">
          {laptop.title}
        </h3>
        {(laptop.cpu || laptop.ram) && (
          <p className="mb-3 text-xs text-[#6B7280] line-clamp-1">
            {[laptop.cpu, laptop.ram].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-[#F3F4F6] pt-3">
          <span className="text-base font-bold text-[#111113]">{formatEGP(laptop.price)}</span>
          <span className="flex items-center gap-0.5 text-xs font-medium text-[#0057D9] opacity-0 transition-opacity group-hover:opacity-100">
            Details <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function LaptopsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<Category[]>('/categories');
      return res.data;
    },
  });

  const { data: laptops, isLoading } = useQuery({
    queryKey: ['laptops', { search, brand, categoryId, minPrice, maxPrice, sort }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (brand) params.append('brand', brand);
      if (categoryId) params.append('categoryId', categoryId);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);
      const res = await api.get<Laptop[]>(`/laptops?${params.toString()}`);
      return res.data;
    },
  });

  const updateFilters = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (brand) params.append('brand', brand);
    if (categoryId) params.append('categoryId', categoryId);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sort) params.append('sort', sort);
    router.push(`/laptops?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch(''); setBrand(''); setCategoryId(''); setMinPrice(''); setMaxPrice(''); setSort('newest');
    router.push('/laptops');
  };

  const hasFilters = search || brand || minPrice || maxPrice;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10 md:px-6">

        {/* Page Header */}
        <div className="mb-8 border-b border-[#E5E7EB] pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#111113]">All Laptops</h1>
              {laptops && (
                <p className="mt-1 text-sm text-[#6B7280]">{laptops.length} products found</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search laptops..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && updateFilters()}
                  className="input-field h-10 w-52 pl-9 text-sm md:w-64"
                />
              </div>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); updateFilters(); }}
                className="input-field h-10 w-auto min-w-[140px] text-sm cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>

              {/* Filters toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  'flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors',
                  isFilterOpen
                    ? 'border-[#0057D9] bg-[#EEF4FF] text-[#0057D9]'
                    : 'border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]'
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0057D9] text-[10px] font-bold text-white">1</span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 animate-fade-in rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label className="label">Brand</label>
                  <select value={brand} onChange={(e) => setBrand(e.target.value)} className="input-field text-sm">
                    <option value="">All brands</option>
                    {['Lenovo', 'ASUS', 'HP', 'Dell', 'MSI', 'Apple', 'Acer', 'Razer'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field text-sm">
                    <option value="">All categories</option>
                    {categories?.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Min price (EGP)</label>
                  <input type="number" placeholder="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="input-field text-sm" />
                </div>
                <div>
                  <label className="label">Max price (EGP)</label>
                  <input type="number" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="input-field text-sm" />
                </div>
                <div className="flex items-end gap-2">
                  <button onClick={updateFilters} className="btn-primary flex-1 h-10 py-0 text-sm">
                    Apply
                  </button>
                  {hasFilters && (
                    <button onClick={clearFilters} className="flex h-10 items-center gap-1 rounded-md px-3 text-sm text-[#6B7280] hover:text-[#111113]">
                      <X className="h-4 w-4" /> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-[#0057D9]" />
            <p className="mt-4 text-sm text-[#6B7280]">Loading products...</p>
          </div>
        ) : laptops && laptops.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {laptops.map((laptop) => (
              <ProductCard key={laptop.id} laptop={laptop} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <svg viewBox="0 0 80 60" className="mb-4 h-12 w-12 text-[#E5E7EB]" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="4" width="72" height="46" rx="4" />
              <path d="M0 56h80M24 50h32" />
            </svg>
            <h3 className="text-base font-semibold text-[#111113]">No results found</h3>
            <p className="mt-2 text-sm text-[#6B7280]">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="btn-secondary mt-6">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LaptopsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0057D9]" />
      </div>
    }>
      <LaptopsCatalog />
    </Suspense>
  );
}
