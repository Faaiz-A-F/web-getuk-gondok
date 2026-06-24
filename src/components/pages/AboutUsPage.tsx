"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";

const heroProducts = [
  { id: "1", name: "Tumpeng Hias", category: "Special", image: "/products/1_20260404_090954_0000.png" },
  { id: "5", name: "Yangko", category: "Traditional", image: "/products/7_20260403_214750_0000.png" },
  { id: "6", name: "Paket Mix", category: "Combo", image: "/products/8_20260403_214750_0001.png" },
  { id: "11", name: "Nampan Set", category: "Serving", image: "/products/13_20260403_214750_0006.png" },
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <span className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-800 shadow-sm">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-amber-950">
            A family recipe from Getuk Gondok <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-500">Magelang</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-neutral-600">
            Getuk Gondok Hj. Sri Rahayu started with a small home kitchen and a simple rule: keep the recipe honest.
            The brand now serves traditional cakes, premium hampers, and event-ready packaging while keeping that same approach.
          </p>
        </div>

        {/* Product Carousel Section */}
        <div className="my-16 flex flex-col items-center justify-center">
          <div className="relative group w-full max-w-lg flex justify-center">
            
            {/* Background Blob/Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl z-0"></div>

            {/* Previous Button */}
            <button
              type="button"
              onClick={goToPreviousHeroProduct}
              aria-label="Previous featured product"
              className="absolute left-0 sm:-left-12 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-900 shadow-lg border border-amber-100 transition-all duration-300 hover:scale-110 hover:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-100 opacity-90 hover:opacity-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative h-80 w-80 sm:h-96 sm:w-96 overflow-hidden z-10">
              <div
                className="flex h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${heroProductIndex * 100}%)` }}
              >
                {heroProducts.map((product) => (
                  <div key={product.id} className="relative h-full min-w-full flex-shrink-0 flex items-center justify-center p-4">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.15)] transition-transform duration-500 hover:scale-105" 
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={goToNextHeroProduct}
              aria-label="Next featured product"
              className="absolute right-0 sm:-right-12 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-900 shadow-lg border border-amber-100 transition-all duration-300 hover:scale-110 hover:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-100 opacity-90 hover:opacity-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex gap-2 mt-8 z-20">
            {heroProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setHeroProductIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === heroProductIndex ? "w-8 bg-amber-700" : "w-2.5 bg-amber-300 hover:bg-amber-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {[
            ["1985", "Established"],
            ["40+", "Years of making traditional snacks"],
            ["1000+", "Customers served"],
          ].map(([value, label], index) => (
            <div 
              key={label} 
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 to-amber-950 p-8 text-center text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-900/20"
            >
              {/* Decorative background accent inside card */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 transition-transform duration-500 group-hover:scale-150"></div>
              
              <div className="relative z-10 text-5xl font-black text-amber-400 mb-3">{value}</div>
              <p className="relative z-10 text-sm font-medium tracking-wide text-amber-100/90">{label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}