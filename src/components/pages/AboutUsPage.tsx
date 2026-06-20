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
    <>
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">About us</p>
        <h1 className="text-4xl font-black tracking-tight text-amber-950">A family recipe from Magelang</h1>
        <p className="max-w-3xl text-base leading-relaxed text-neutral-700">
          Getuk Gondok Hj. Sri Rahayu started with a small home kitchen and a simple rule: keep the recipe honest.
          The brand now serves traditional cakes, premium hampers, and event-ready packaging while keeping that same approach.
        </p>
      </div>

      <div className="my-16 flex justify-center">
        <div className="relative">
          <button
            type="button"
            onClick={goToPreviousHeroProduct}
            aria-label="Previous featured product"
            className="absolute left-[-3.5rem] top-1/2 z-20 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-amber-900 shadow-xl transition hover:bg-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative h-96 w-96 overflow-hidden rounded-lg">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${heroProductIndex * 100}%)` }}
            >
              {heroProducts.map((product) => (
                <div key={product.id} className="relative h-full min-w-full flex-shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-contain drop-shadow-2xl" />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goToNextHeroProduct}
            aria-label="Next featured product"
            className="absolute right-[-3.5rem] top-1/2 z-20 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-amber-900 shadow-xl transition hover:bg-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          ["1985", "Established"],
          ["40+", "Years of making traditional snacks"],
          ["1000+", "Customers served"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-3xl bg-amber-950 p-6 text-white shadow-lg">
            <div className="text-4xl font-black text-amber-400">{value}</div>
            <p className="mt-3 text-sm leading-6 text-amber-100">{label}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}