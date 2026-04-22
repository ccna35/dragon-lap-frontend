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
  Gamepad2,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { formatEGP } from '@/lib/utils';
import { Laptop } from '@/types/api';
import { HeroCarousel } from '@/components/home/hero-carousel';
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
      href={`/laptops/${laptop.slug}`}
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
        {laptop.featuredImage?.url ? (
          <img
            src={laptop.featuredImage.url}
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
      desc: 'RTX graphics & 240Hz screens',
      icon: Gamepad2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50/50',
      border: 'hover:border-indigo-200',
      href: '/laptops?category=gaming',
    },
    {
      label: 'Professional',
      desc: 'Reliable workstation power',
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50/50',
      border: 'hover:border-blue-200',
      href: '/laptops?category=professional',
    },
    {
      label: 'Ultrabook',
      desc: 'Thin, light, all-day power',
      icon: Monitor,
      color: 'text-sky-600',
      bg: 'bg-sky-50/50',
      border: 'hover:border-sky-200',
      href: '/laptops?category=ultrabook',
    },
    {
      label: 'Student',
      desc: 'Perfect balance of price & performance',
      icon: GraduationCap,
      color: 'text-green-600',
      bg: 'bg-green-50/50',
      border: 'hover:border-green-200',
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
      <HeroCarousel />

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
          <div className="mb-12 flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#0057D9]">Our Collection</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#111113] md:text-4xl">Shop by need</h2>
              <p className="mt-2 text-base text-[#6B7280]">Expertly curated selections for every lifestyle</p>
            </div>
            <Link href="/laptops" className="group mt-6 flex items-center gap-2 text-sm font-bold text-[#0057D9] md:mt-0">
              Explore All <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] ${cat.border}`}
              >
                {/* Accent Background */}
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${cat.bg} transition-transform duration-500 group-hover:scale-150`} />
                
                <div className="relative">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${cat.bg} ${cat.color} transition-colors group-hover:bg-white group-hover:shadow-sm`}>
                    <cat.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#111113]">{cat.label}</h3>
                  <p className="text-sm leading-relaxed text-[#6B7280]">{cat.desc}</p>
                  
                  <div className={`mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${cat.color} opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100`}>
                    View Collection <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
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
