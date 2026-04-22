'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, ShieldCheck, Award } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'Dominate the Game',
    subtitle: 'Next-Gen RTX 40-Series Laptops',
    description: 'Experience unparalleled performance with the latest gaming rigs. High refresh rates, liquid cooling, and pure power.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop',
    cta: 'Shop Gaming',
    href: '/laptops?category=gaming',
    badge: 'Limited Offer',
    color: 'from-indigo-600/20 to-purple-600/20'
  },
  {
    id: 2,
    title: 'The Executive Standard',
    subtitle: 'Premium Ultrabooks for Professionals',
    description: 'Sleek, powerful, and built to last. All-day battery life and stunning displays for the modern workspace.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop',
    cta: 'Explore Business',
    href: '/laptops?category=professional',
    badge: 'New Arrival',
    color: 'from-blue-600/20 to-sky-600/20'
  },
  {
    id: 3,
    title: 'Back to University',
    subtitle: 'Best Value for Students',
    description: 'Reliable performance that fits your budget. Perfect for coding, designing, and everything in between.',
    image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=2070&auto=format&fit=crop',
    cta: 'View Student Deals',
    href: '/laptops?category=student',
    badge: 'Student Special',
    color: 'from-green-600/20 to-teal-600/20'
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-[#111113]">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={SLIDES[current].image}
              alt={SLIDES[current].title}
              className="h-full w-full object-cover opacity-60"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${SLIDES[current].color} mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111113]/80 via-[#111113]/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="container relative mx-auto flex h-full items-center px-4 md:px-12 lg:px-20">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
              >
                <Zap className="h-3.5 w-3.5 text-[#0057D9]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  {SLIDES[current].badge}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-2 text-xl font-medium text-[#0057D9]"
              >
                {SLIDES[current].subtitle}
              </motion.h2>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6 text-5xl font-extrabold leading-tight text-white md:text-7xl"
              >
                {SLIDES[current].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8 text-lg text-[#9CA3AF]"
              >
                {SLIDES[current].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href={SLIDES[current].href}
                  className="group flex items-center gap-2 rounded-full bg-[#0057D9] px-8 py-4 font-bold text-white transition-all hover:bg-[#003FA3] hover:shadow-[0_0_20px_rgba(0,87,217,0.4)]"
                >
                  {SLIDES[current].cta}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/laptops"
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/10"
                >
                  View Catalog
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows (Bottom Right) */}
      <div className="absolute bottom-24 right-6 z-20 flex gap-2 md:bottom-12 md:right-12">
        <button
          onClick={prevSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all hover:bg-white/10 hover:text-[#0057D9]"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all hover:bg-white/10 hover:text-[#0057D9]"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-6 z-20 flex gap-2 md:left-12">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              current === i ? 'w-8 bg-[#0057D9]' : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Stats / Trust Bar (Mini) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 hidden border-t border-white/5 bg-[#111113]/40 backdrop-blur-xl lg:block">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#0057D9]" />
                <span className="text-xs font-medium text-white/70">2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#0057D9]" />
                <span className="text-xs font-medium text-white/70">Genuine Products</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/40">
              <span>Scroll to explore</span>
              <div className="h-px w-12 bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
