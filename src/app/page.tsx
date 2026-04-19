import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Headphones,
  RotateCcw,
  ChevronRight,
  Star,
  Cpu,
  MemoryStick,
  Monitor,
  TrendingUp,
  Award,
  Package,
} from 'lucide-react';
import { formatEGP } from '@/lib/utils';
import { Laptop } from '@/types/api';
import api from '@/lib/api-client';

async function getFeaturedLaptops(): Promise<Laptop[]> {
  try {
    const res = await api.get<Laptop[]>('/laptops');
    return res.data.slice(0, 8);
  } catch {
    return [];
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductCard({ laptop, index }: { laptop: Laptop; index: number }) {
  const isNew = index < 2;
  const isPopular = index === 2;

  return (
    <Link
      href={`/laptops/${laptop.id}`}
      className="product-card group flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F9FAFB] p-6">
        {isNew && (
          <span className="badge badge-blue absolute left-3 top-3 z-10">New</span>
        )}
        {isPopular && (
          <span className="absolute left-3 top-3 z-10 badge bg-[#FFF7ED] text-orange-600">
            Popular
          </span>
        )}
        {laptop.imageUrl ? (
          <img
            src={laptop.imageUrl}
            alt={laptop.title}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              viewBox="0 0 80 60"
              className="h-16 w-16 text-[#D1D5DB]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="4" y="4" width="72" height="46" rx="4" />
              <path d="M0 56h80M24 50h32" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#0057D9]">
          {laptop.brand}
        </p>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-[#111113] group-hover:text-[#0057D9] transition-colors">
          {laptop.title}
        </h3>
        {(laptop.cpu || laptop.ram) && (
          <p className="mb-3 text-xs text-[#6B7280] line-clamp-1">
            {[laptop.cpu, laptop.ram].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-[#F3F4F6] pt-3">
          <span className="text-base font-bold text-[#111113]">{formatEGP(laptop.price)}</span>
          <span className="flex items-center gap-1 text-xs font-medium text-[#0057D9] opacity-0 transition-opacity group-hover:opacity-100">
            View <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const laptops = await getFeaturedLaptops();
  const featured = laptops.slice(0, 4);
  const newArrivals = laptops.slice(4, 8);

  const categories = [
    {
      label: 'Gaming',
      desc: 'High-refresh displays, RTX graphics',
      icon: '🎮',
      color: 'bg-indigo-50',
      href: '/laptops?category=gaming',
    },
    {
      label: 'Professional',
      desc: 'Workstation-grade performance',
      icon: '💼',
      color: 'bg-blue-50',
      href: '/laptops?category=professional',
    },
    {
      label: 'Ultrabook',
      desc: 'Thin, light, all-day battery',
      icon: '✈️',
      color: 'bg-sky-50',
      href: '/laptops?category=ultrabook',
    },
    {
      label: 'Student',
      desc: 'Reliable performance, great value',
      icon: '📚',
      color: 'bg-green-50',
      href: '/laptops?category=student',
    },
  ];

  const brands = ['ASUS', 'Lenovo', 'HP', 'Dell', 'MSI', 'Apple', 'Acer', 'Razer'];

  const specs = [
    { icon: Cpu, label: 'Latest gen Intel / AMD', sub: 'Up to Core i9 / Ryzen 9' },
    { icon: MemoryStick, label: 'Up to 128GB RAM', sub: 'DDR5 / LPDDR5' },
    { icon: Monitor, label: 'OLED & 4K displays', sub: 'Up to 240Hz refresh' },
  ];

  const trustItems = [
    { icon: ShieldCheck, title: '2-Year Warranty', desc: 'On all products, no questions asked' },
    { icon: RotateCcw, title: '14-Day Returns', desc: 'Free returns on unopened items' },
    { icon: Package, title: 'Free Shipping', desc: 'On all orders nationwide' },
    { icon: Headphones, title: '24/7 Support', desc: 'Chat, email and phone' },
  ];

  const reviews = [
    {
      name: 'Ahmed Khaled',
      role: '3D Artist',
      body: `The RTX 4080 laptop I ordered arrived in perfect condition. Performance is insane for DaVinci Resolve. Dragon Lap's support team was super helpful too.`,
      rating: 5,
    },
    {
      name: 'Sara Mostafa',
      role: 'Software Engineer',
      body: 'I was skeptical ordering a high-end laptop online, but the price was better than any local shop and it arrived next day. Highly recommend.',
      rating: 5,
    },
    {
      name: 'Omar Fathy',
      role: 'CS Student',
      body: 'Got a great Lenovo Legion at a fair price. Website is easy to navigate and the specs are clearly listed. Will buy again.',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col">

      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
        {/* Background accent — subtle, not distracting */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#EEF4FF] opacity-60 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 md:px-6">
          <div className="grid min-h-[580px] grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-0">
            {/* Left */}
            <div className="animate-fade-up max-w-lg">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#0057D9]" />
                <span className="text-xs font-medium text-[#374151]">#1 Laptop Store in Egypt</span>
              </div>

              <h1 className="mb-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-[#111113] md:text-6xl">
                Find your perfect<br />
                <span className="text-[#0057D9]">laptop.</span>
              </h1>

              <p className="mb-8 text-lg leading-relaxed text-[#6B7280]">
                Competitive prices, genuine products, and fast delivery across Egypt. From budget ultrabooks to high-end gaming rigs — we&apos;ve got it all.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/laptops" className="btn-primary px-8 py-3.5 text-sm">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/laptops?sort=popular" className="btn-secondary px-8 py-3.5 text-sm">
                  Best Sellers
                </Link>
              </div>

              {/* Mini stats */}
              <div className="mt-10 flex items-center gap-8 border-t border-[#E5E7EB] pt-8">
                {[
                  { value: '500+', label: 'Products' },
                  { value: '10K+', label: 'Happy customers' },
                  { value: '4.9', label: 'Avg. rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-[#111113]">{stat.value}</p>
                    <p className="text-xs text-[#9CA3AF]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product showcase */}
            <div className="animate-fade-up delay-200 relative hidden lg:block">
              <div className="relative mx-auto max-w-md">
                {/* Main card */}
                <div className="relative rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="badge badge-blue">Featured</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-[#374151]">4.9</span>
                    </div>
                  </div>
                  {/* Laptop silhouette illustration */}
                  <div className="flex items-center justify-center py-10">
                    <div className="relative">
                      <div className="h-44 w-72 rounded-lg border-2 border-[#D1D5DB] bg-white shadow-inner flex items-center justify-center">
                        <div className="h-36 w-60 rounded bg-[#111113] flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-black text-[#0057D9]">DL</div>
                            <div className="text-xs text-[#6B7280] mt-1">Pro Series</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-1 h-3 w-80 -ml-4 rounded-b-xl border-2 border-[#D1D5DB] bg-[#E5E7EB]" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#374151]">Starting from</p>
                    <p className="text-3xl font-extrabold text-[#111113]">EGP 25,000</p>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -left-6 top-1/4 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Package className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#111113]">Free Shipping</p>
                      <p className="text-[10px] text-[#9CA3AF]">Nationwide</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-16 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-[#0057D9]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#111113]">2-Year Warranty</p>
                      <p className="text-[10px] text-[#9CA3AF]">All products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. TRUST BAR ────────────────────────────────────────────────── */}
      <section className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 divide-x divide-[#E5E7EB] md:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-center gap-3 px-6 py-5">
                <item.icon className="h-5 w-5 shrink-0 text-[#0057D9]" />
                <div>
                  <p className="text-sm font-semibold text-[#111113]">{item.title}</p>
                  <p className="text-xs text-[#9CA3AF]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. CATEGORIES ───────────────────────────────────────────────── */}
      <section className="section border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#111113]">Shop by need</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Find exactly what you&apos;re looking for</p>
            </div>
            <Link href="/laptops" className="hidden items-center gap-1 text-sm font-medium text-[#0057D9] hover:underline md:flex">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`group flex flex-col rounded-xl ${cat.color} p-6 transition-all hover:shadow-md hover:-translate-y-0.5 border border-transparent hover:border-[#D1D5DB]`}
              >
                <span className="mb-3 text-3xl">{cat.icon}</span>
                <p className="font-semibold text-[#111113]">{cat.label}</p>
                <p className="mt-1 text-xs text-[#6B7280] leading-relaxed">{cat.desc}</p>
                <span className="mt-4 flex items-center gap-1 text-xs font-medium text-[#0057D9] opacity-0 transition-opacity group-hover:opacity-100">
                  Browse <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. FEATURED PRODUCTS ────────────────────────────────────────── */}
      <section className="section border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#0057D9]">Curated picks</p>
              <h2 className="text-2xl font-bold tracking-tight text-[#111113]">Featured laptops</h2>
            </div>
            <Link href="/laptops" className="flex items-center gap-1 text-sm font-medium text-[#0057D9] hover:underline">
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((laptop, i) => (
                <ProductCard key={laptop.id} laptop={laptop} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E7EB] py-20 text-center">
              <svg viewBox="0 0 80 60" className="mb-4 h-12 w-12 text-[#D1D5DB]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="72" height="46" rx="4" />
                <path d="M0 56h80M24 50h32" />
              </svg>
              <p className="font-medium text-[#374151]">No products found</p>
              <p className="mt-1 text-sm text-[#9CA3AF]">Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── 5. SPEC HIGHLIGHT BANNER ────────────────────────────────────── */}
      <section className="section border-b border-[#E5E7EB] bg-[#111113]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0057D9]">Built for performance</p>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
                Every laptop is<br />spec-verified and tested.
              </h2>
              <p className="mt-4 text-[#9CA3AF] leading-relaxed">
                We source directly from certified distributors. Every product page shows verified specs — no marketing fluff, just the facts.
              </p>
              <Link href="/laptops" className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#0057D9] px-6 py-3 text-sm font-semibold text-white hover:bg-[#003FA3] transition-colors">
                Browse catalog <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <s.icon className="mb-3 h-5 w-5 text-[#0057D9]" />
                  <p className="font-semibold text-white text-sm">{s.label}</p>
                  <p className="mt-1 text-xs text-[#6B7280]">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. BRANDS ───────────────────────────────────────────────────── */}
      <section className="section-sm border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 md:px-6">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">
            Authorized retailer of top brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/laptops?brand=${brand}`}
                className="text-base font-bold tracking-tight text-[#9CA3AF] transition-colors hover:text-[#111113]"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. NEW ARRIVALS ─────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="section border-b border-[#E5E7EB]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#0057D9]">Just in</p>
                <h2 className="text-2xl font-bold tracking-tight text-[#111113]">New arrivals</h2>
              </div>
              <Link href="/laptops?sort=new" className="flex items-center gap-1 text-sm font-medium text-[#0057D9] hover:underline">
                View all new <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((laptop, i) => (
                <ProductCard key={laptop.id} laptop={laptop} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 8. REVIEWS ──────────────────────────────────────────────────── */}
      <section className="section border-b border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111113]">4.9 out of 5</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Based on 1,200+ verified customer reviews</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.name} className="card p-6">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-[#374151]">&quot;{review.body}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF4FF] text-sm font-bold text-[#0057D9]">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111113]">{review.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. BOTTOM CTA ───────────────────────────────────────────────── */}
      <section className="section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-2xl bg-[#0057D9] px-8 py-14 text-center md:px-16">
            <Award className="mx-auto mb-4 h-10 w-10 text-white/40" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Ready to upgrade?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[#93C5FD] leading-relaxed">
              Join over 10,000 customers who trust Dragon Lap for their laptop needs. Free shipping, 2-year warranty, 14-day returns.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/laptops"
                className="inline-flex items-center gap-2 rounded-md bg-white px-8 py-3.5 text-sm font-semibold text-[#0057D9] transition-all hover:bg-[#EEF4FF] active:scale-[0.98]"
              >
                Browse all laptops <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
