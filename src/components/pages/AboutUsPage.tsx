"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";

const heroProducts = [
  { id: "1", name: "Tumpeng Hias", category: "Special", video: "/sudah dipotong/video tumpeng.mp4" },
  { id: "5", name: "Yangko", category: "Traditional", video: "/sudah dipotong/video 2.mp4" },
  { id: "6", name: "Paket Mix", category: "Combo", video: "/sudah dipotong/video 3.mp4" },
  { id: "11", name: "Nampan Set", category: "Serving", video: "/sudah dipotong/video 4.mp4" },
];

export function AboutUsPage() {
  const [heroProductIndex, setHeroProductIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroProductIndex((currentIndex) => (currentIndex + 1) % heroProducts.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToPreviousHeroProduct = () => {
    setHeroProductIndex((currentIndex) => (currentIndex - 1 + heroProducts.length) % heroProducts.length);
  };

  const goToNextHeroProduct = () => {
    setHeroProductIndex((currentIndex) => (currentIndex + 1) % heroProducts.length);
  };

  return (
    <div className="min-h-screen bg-[#530505]">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
            About Us
          </p>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Getuk Gondok Hj. Sri Rahayu
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-amber-100/80">
            Resep turun-temurun dari Magelang. Dimulai dari dapur kecil rumah,
            kini melayani kue tradisional, hampers premium, dan kemasan acara.
          </p>
        </div>

        {/* Product Carousel Section */}
        <div className="mb-12 flex flex-col items-center">
          <div className="relative flex w-full items-center justify-center gap-4">
            
            {/* Previous Button */}
            <button
              type="button"
              onClick={goToPreviousHeroProduct}
              aria-label="Previous featured product"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative h-64 w-64 overflow-hidden sm:h-72 sm:w-72">
              <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${heroProductIndex * 100}%)` }}
              >
                {heroProducts.map((product) => (
                  <div key={product.id} className="relative h-full min-w-full flex-shrink-0 flex items-center justify-center p-2">
                    <video
                      src={product.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={goToNextHeroProduct}
              aria-label="Next featured product"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="mt-6 flex gap-2">
            {heroProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setHeroProductIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === heroProductIndex ? "w-6 bg-amber-400" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["1985", "Didirikan"],
            ["40+", "Tahun pengalaman"],
            ["1000+", "Pelanggan puas"],
          ].map(([value, label]) => (
            <div 
              key={label} 
              className="rounded-xl bg-white/5 p-6 text-center"
            >
              <div className="mb-1 text-3xl font-bold text-amber-400">{value}</div>
              <p className="text-xs font-medium text-amber-100/70">{label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
