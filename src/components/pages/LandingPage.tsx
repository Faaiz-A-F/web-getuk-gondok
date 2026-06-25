"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const products = [
  { id: "1", name: "Tumpeng Hias", category: "Special", image: "/products/1_20260404_090954_0000.png", price: 75000, description: "Tumpeng hias premium untuk acara spesial" },
  { id: "2", name: "Tumpeng Hiasan", category: "Premium", image: "/products/2_20260404_090954_0001.png", price: 85000, description: "Hiasan tumpeng mewah berkualitas tinggi" },
  { id: "3", name: "Nampan Specialty", category: "Deluxe", image: "/products/3_20260404_090954_0002.png", price: 95000, description: "Nampan specialty dengan desain elegan" },
  { id: "4", name: "Kardus Packaging", category: "Box", image: "/products/4_20260404_090954_0003.png", price: 15000, description: "Packaging kardus standar yang kuat" },
  { id: "5", name: "Yangko", category: "Traditional", image: "/products/7_20260403_214750_0000.png", price: 25000, description: "Kue tradisional yang lezat dan otentik" },
  { id: "6", name: "Paket Mix", category: "Combo", image: "/products/8_20260403_214750_0001.png", price: 120000, description: "Paket mix lengkap untuk berbagai kebutuhan" },
  { id: "7", name: "Tampah Set", category: "Traditional", image: "/products/9_20260403_214750_0002.png", price: 45000, description: "Set tampah tradisional asli Magelang" },
  { id: "8", name: "Kardus Kecil", category: "Box", image: "/products/10_20260403_214750_0003.png", price: 10000, description: "Kardus kecil praktis untuk pengiriman" },
  { id: "9", name: "Kardus Sedang", category: "Box", image: "/products/11_20260403_214750_0004.png", price: 15000, description: "Kardus sedang dengan kekuatan optimal" },
  { id: "10", name: "Kardus Besar", category: "Box", image: "/products/12_20260403_214750_0005.png", price: 20000, description: "Kardus besar jumbo untuk paket istimewa" },
  { id: "11", name: "Nampan Set", category: "Serving", image: "/products/13_20260403_214750_0006.png", price: 55000, description: "Set nampan elegan untuk sajian" },
  { id: "12", name: "Jongkong", category: "Traditional", image: "/products/14_20260403_214750_0007.png", price: 30000, description: "Jongkong autentik rasa istimewa" },
  { id: "13", name: "Wajik Jadah", category: "Sweet", image: "/products/15_20260403_214750_0008.png", price: 35000, description: "Wajik jadah manis legit tradisional" },
  { id: "14", name: "Tampah Large", category: "Serving", image: "/products/16_20260403_214751_0009.png", price: 65000, description: "Tampah large berkualitas super" },
  { id: "15", name: "Klepon", category: "Traditional", image: "/products/17_20260403_214751_0010.png", price: 28000, description: "Klepon kenyal segar gula merah" },
  { id: "16", name: "Tampah Extra", category: "Serving", image: "/products/18_20260403_214751_0011.png", price: 70000, description: "Tampah extra besar untuk pesta" },
  { id: "17", name: "Wingko", category: "Sweet", image: "/products/19_20260403_214751_0012.png", price: 32000, description: "Wingko babat terkenal Magelang" },
  { id: "18", name: "Nampan Deluxe", category: "Serving", image: "/products/20_20260403_214751_0013.png", price: 100000, description: "Nampan deluxe premium eksklusif" },
  { id: "19", name: "Tampah Premium", category: "Serving", image: "/products/21_20260403_214751_0014.png", price: 120000, description: "Tampah premium untuk acara besar" },
  { id: "20", name: "Kardus Jumbo", category: "Box", image: "/products/22_20260403_214751_0015.png", price: 25000, description: "Kardus jumbo tahan lama kuat" },
];

const heroProducts = [products[0], products[4], products[5], products[10]];

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
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
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-amber-200 selection:text-amber-900">
      <Header />

      <section className="relative overflow-hidden bg-amber-950 text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-800 blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-orange-700 blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/50 border border-amber-700/50 text-amber-200 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Buka & Menerima Pesanan
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight">
                Kelezatan <span className="text-amber-400">Autentik</span> Sejak 1985.
              </h1>
              <p className="text-lg lg:text-xl text-amber-100/80 max-w-2xl mx-auto lg:mx-0">
                Oleh-oleh khas Magelang dengan resep warisan. Tumpeng hias, jajanan tradisional, dan hampers premium untuk momen spesial Anda.
              </p>

              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {/* Input ini bisa dibungkus <form> ke depannya untuk navigasi ke halaman katalog */}
                <input
                  type="text"
                  placeholder="Cari produk kesukaanmu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 rounded-full border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-lg shadow-xl"
                />
              </div>
            </div>

            <div className="hidden lg:block relative">
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

              <div className="relative h-125 overflow-hidden">
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
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8 max-w-2xl">
              <p className="text-sm font-medium tracking-[0.2em] text-neutral-500 uppercase">Kenapa Getuk Gondok?</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-[#c97a2d]">
                Bukan Sekadar Oleh-Oleh.
                <br />
                Ini Sepotong Cerita Keluarga.
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-neutral-800 max-w-xl">
                Sejak 1985, Hj. Sri Rahayu meracik getuk dengan tangan sendiri dan menggunakan singkong segar Magelang,
                kelapa muda, dan gula merah pilihan. Tidak ada jalan pintas, tidak ada bahan pengawet.
                <br />
                Kini hadir dalam berbagai pilihan kemasan modern, tetap dengan resep yang sama: autentik, lembut, dan penuh rasa.
              </p>

              <div className="grid grid-cols-3 gap-6 sm:gap-10 max-w-xl pt-2">
                <div>
                  <div className="text-3xl sm:text-4xl font-semibold text-[#d89a34]">40+</div>
                  <div className="mt-2 text-xs sm:text-sm text-neutral-600">Tahun Pengalaman</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-semibold text-[#d89a34]">10+</div>
                  <div className="mt-2 text-xs sm:text-sm text-neutral-600">Varian Produk</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-semibold text-[#d89a34]">1000+</div>
                  <div className="mt-2 text-xs sm:text-sm text-neutral-600">Pelanggan Setia</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-center">
              <div className="relative w-full max-w-55 rounded-4xl bg-[#5a2500] px-8 py-10 text-center shadow-[0_24px_60px_rgba(90,37,0,0.28)] text-[#d89a34]">
                <div className="text-3xl font-semibold tracking-[0.15em] uppercase">Since</div>
                <div className="mt-2 flex w-full justify-center text-6xl sm:text-7xl font-extrabold leading-none tabular-nums">1985</div>
                <div className="mx-auto mt-4 h-px w-20 bg-[#d89a34]/70" />
                <div className="mt-5 text-xl leading-tight text-white/95">
                  Magelang,
                  <br />
                  Jawa Tengah
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <p className="text-sm font-medium tracking-[0.2em] text-amber-700 uppercase">Proses Produksi</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-amber-900">
              Dari Singkong Segar Hingga Oleh-Oleh Premium
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-amber-800 max-w-xl mx-auto">
              Setiap produk kami dibuat dengan tangan, dimulai dari singkong segar pilihan, kelapa muda, dan gula merah alami.
              <br />
              Proses tradisional yang kami pertahankan selama puluhan tahun memastikan rasa autentik dan kualitas terbaik.
            </p>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}