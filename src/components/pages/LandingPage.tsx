"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeaderLandingPage } from "@/components/layout/HeaderLandingPage"; // use this version for the landing page header instead of the default Header component
import { Footer } from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Heading4 } from "lucide-react";

const products = [
  { id: "1", name: "Tumpeng Hias", category: "Special", image: "/nobg/1.png", price: 75000, description: "Tumpeng hias premium untuk acara spesial" },
  { id: "2", name: "Tumpeng Hiasan", category: "Premium", image: "/nobg/2.png", price: 85000, description: "Hiasan tumpeng mewah berkualitas tinggi" },
  { id: "3", name: "Nampan Specialty", category: "Deluxe", image: "/nobg/3.png", price: 95000, description: "Nampan specialty dengan desain elegan" },
  { id: "4", name: "Kardus Packaging", category: "Box", image: "/nobg/4.png", price: 15000, description: "Packaging kardus standar yang kuat" },
  { id: "5", name: "Hampers Premium", category: "Gift", image: "/nobg/5.png", price: 120000, description: "Hampers premium untuk hadiah istimewa" },
  { id: "6", name: "Getuk Tradisional", category: "Traditional", image: "/nobg/6.png", price: 25000, description: "Getuk tradisional khas Magelang" },
  { id: "7", name: "Kue Kering", category: "Snack", image: "/nobg/7.png", price: 30000, description: "Kue kering lezat untuk camilan" },
  { id: "8", name: "Jajanan Pasar", category: "Snack", image: "/nobg/8.png", price: 20000, description: "Jajanan pasar autentik dan enak" },
  { id: "9", name: "Paket Oleh-Oleh", category: "Gift Set", image: "/nobg/9.png", price: 100000, description: "Paket oleh-oleh lengkap untuk keluarga"},
  { id: "10", name: "Kue Basah", category: "Snack", image: "/nobg/10.png", price: 35000, description: "Kue basah segar dan lezat" },
  { id: "11", name: "Kue Tradisional", category: "Traditional", image: "/nobg/11.png", price: 40000, description: "Kue tradisional khas Magelang" },
  { id: "12", name: "Paket Snack Box", category: "Gift Set", image: "/nobg/12.png", price: 80000, description: "Paket snack box untuk acara spesial" },
  { id: "13", name: "Kue Kering Premium", category: "Snack", image: "/nobg/13.png", price: 45000, description: "Kue kering premium dengan rasa istimewa" },
  { id: "14", name: "Hampers Keluarga", category: "Gift Set", image: "/nobg/14.png", price: 150000, description: "Hampers keluarga lengkap dengan berbagai"},
  { id: "15", name: "Kardus Packaging", category: "Box", image: "/nobg/15.png", price: 15000, description: "Packaging kardus standar yang kuat" },
  { id: "16", name: "Kardus Pakaging", category: "Box", image: "/nobg/16.png", price: 15000, description: "Packaging kardus standar yang kuat" },
  { id: "17", name: "Kardus Packaging", category: "Box", image: "/nobg/17.png", price: 15000, description: "Packaging kardus standar yang kuat" },
  { id: "18", name: "Kardus Packaging", category: "Box", image: "/nobg/18.png", price: 15000, description: "Packaging kardus standar yang kuat" },
  { id: "19", name: "Kardus Packaging", category: "Box", image: "/nobg/19.png", price: 15000, description: "Packaging kardus standar yang kuat" },
  { id: "20", name: "Kardus Packaging", category: "Box", image: "/nobg/20.png", price: 15000, description: "Packaging kardus standar yang kuat" },
  { id: "21", name: "Kardus Packaging", category: "Box", image: "/nobg/21.png", price: 15000, description: "Packaging kardus standar yang kuat" },
];

const heroProducts = products.filter((product) => Boolean(product));
const featuredProducts = products.slice(0, 3);
const benefits = [
  {
    title: "Resep Warisan",
    description: "Diproduksi dengan cara tradisional yang diwariskan turun-temurun dan tetap menjaga cita rasa autentik.",
  },
  {
    title: "Bahan Pilihan",
    description: "Menggunakan singkong segar, kelapa muda, dan gula merah alami untuk kualitas terbaik di setiap produk.",
  },
  {
    title: "Kemasan Premium",
    description: "Tersedia dalam berbagai pilihan kemasan modern yang cocok untuk hadiah, hampers, maupun acara spesial.",
  },
];

const steps = [
  { title: "Pilih Produk", description: "Temukan produk favorit Anda dari koleksi unggulan kami." },
  { title: "Konsultasi Pesanan", description: "Kami bantu menyesuaikan jumlah, kemasan, dan kebutuhan acara Anda." },
  { title: "Pesanan Siap Dikirim", description: "Produk dipersiapkan dengan rapi dan dikirim tepat waktu ke lokasi Anda." },
];

const testimonials = [
  {
    name: "Dewi P.",
    role: "Customer",
    quote: "Rasa getuknya masih sama enak dan autentik seperti yang saya kenal sejak kecil. Packaging-nya juga sangat elegan.",
  },
  {
    name: "Rizky A.",
    role: "Pembeli Hampers",
    quote: "Saya memesannya untuk acara keluarga dan hasilnya sangat memuaskan. Semua tamu memberi pujian.",
  },
  {
    name: "Siti M.",
    role: "Pemesan Khusus",
    quote: "Pelayanannya cepat, komunikasinya jelas, dan kualitas produk sangat konsisten. Sangat recommended.",
  },
];

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [heroProductIndex, setHeroProductIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const historyCardRef = useRef<HTMLDivElement | null>(null);
  const historyRevealTimeoutRef = useRef<number | null>(null);

  const historyMessage =
    "Getuk Gondok lahir dari resep rumahan yang dijaga sejak 1985. Dari tangan Hj. Sri Rahayu, singkong Magelang diolah menjadi oleh-oleh yang tetap lembut, autentik, dan kini tampil lebih modern.";

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroProductIndex((currentIndex) => (currentIndex + 1) % heroProducts.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const historyCard = historyCardRef.current;

    if (!historyCard) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (historyRevealTimeoutRef.current) {
          window.clearTimeout(historyRevealTimeoutRef.current);
          historyRevealTimeoutRef.current = null;
        }

        setIsHistoryVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          setIsHistoryVisible(false);
          historyRevealTimeoutRef.current = window.setTimeout(() => {
            setIsHistoryVisible(true);
            historyRevealTimeoutRef.current = null;
          }, 3000);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(historyCard);

    return () => {
      observer.disconnect();

      if (historyRevealTimeoutRef.current) {
        window.clearTimeout(historyRevealTimeoutRef.current);
        historyRevealTimeoutRef.current = null;
      }
    };
  }, []);

  const goToPreviousHeroProduct = () => {
    setHeroProductIndex((currentIndex) => (currentIndex - 1 + heroProducts.length) % heroProducts.length);
  };

  const goToNextHeroProduct = () => {
    setHeroProductIndex((currentIndex) => (currentIndex + 1) % heroProducts.length);
  };

  const toggleBackgroundAudio = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setIsAudioPlaying(true);
      } catch {
        setIsAudioPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsAudioPlaying(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans transition-colors duration-300 selection:bg-amber-200 selection:text-amber-900">
      <HeaderLandingPage />

      <section className="relative overflow-hidden bg-amber-950 text-white shadow-[0_20px_60px_rgba(120,53,15,0.16)]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-800 blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-orange-700 blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 rounded-[2rem] border border-white/10 bg-white/10 p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-sm sm:p-8 lg:text-left">
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
                <input
                  type="text"
                  placeholder="Cari produk kesukaanmu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 rounded-full border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-lg shadow-xl"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/catalogue"
                  className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-300"
                >
                  Lihat Katalog
                </Link>
                <Link
                  href="/about-us"
                  className="inline-flex items-center justify-center rounded-full border border-amber-300/60 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:bg-white/10"
                >
                  Kenali Brand Kami
                </Link>
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
                  {heroProducts.map((product) => {
                    const heroImageSrc = product.image?.trim() ? product.image : "/nobg/1.png";
                    const heroImageAlt = product.name?.trim() ? product.name : "Featured product";

                    return (
                      <div key={`${product.id}-${product.name}`} className="relative h-full min-w-full flex-shrink-0">
                        <Image
                          src={heroImageSrc}
                          alt={heroImageAlt}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain drop-shadow-2xl"
                        />
                      </div>
                    );
                  })}
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
              <div
                ref={historyCardRef}
                className="group relative w-full max-w-none overflow-hidden rounded-4xl border border-[#d89a34]/35 bg-[#5a2500] px-6 py-8 text-left shadow-[0_24px_60px_rgba(90,37,0,0.28)] text-[#d89a34] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(90,37,0,0.34)] sm:px-8 sm:py-10 lg:min-h-[22rem]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6b2c00]/95 via-transparent to-[#7a3a07]/50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,220,160,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_38%)]" />

                <div className="relative z-10 flex h-full min-h-[18rem] flex-col justify-between gap-6 sm:min-h-[20rem] lg:min-h-[22rem]">
                  <div className="space-y-3">
                    <div className="text-3xl font-semibold tracking-[0.15em] uppercase">Since</div>
                    <div className="flex w-full items-end gap-4">
                      <div className="text-6xl font-extrabold leading-none tabular-nums sm:text-7xl">1985</div>
                    </div>
                    <div className="h-px w-20 bg-[#d89a34]/70" />
                  </div>

                  <div
                    className={`space-y-3 text-white/95 transition-all duration-500 ease-out ${
                      isHistoryVisible ? "translate-x-5 opacity-100" : "translate-x-0 opacity-0"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f2c47a]">Sejarah Getuk Gondok</p>
                    <p className="text-base leading-7 text-white/90">{historyMessage}</p>
                  </div>

                  <div className={`text-xl leading-tight text-white/95 transition-all duration-700 ease-out ${isHistoryVisible ? "translate-x-5 opacity-0" : "translate-x-0 opacity-100"}`}>
                    Magelang,
                    <br />
                    Jawa Tengah
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-sm font-medium tracking-[0.2em] text-amber-700 uppercase">Mengapa Memilih Kami</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-amber-900">
                Kepercayaan pelanggan dibangun dari kualitas yang konsisten.
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-amber-800">
                Kami menggabungkan tradisi, ketelitian, dan pelayanan yang personal agar setiap pesanan terasa istimewa.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(201,122,45,0.12)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-lg font-semibold text-amber-800">
                    ✦
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <p className="text-sm font-medium tracking-[0.2em] text-neutral-500 uppercase">Cara Pesan</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-neutral-900">
              Proses yang sederhana, cepat, dan nyaman
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(0,0,0,0.08)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-lg font-semibold text-amber-800">
                  0{index + 1}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-neutral-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#5a2500] py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <p className="text-sm font-medium tracking-[0.2em] text-amber-200 uppercase">Testimoni Pelanggan</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
              Apa kata mereka tentang produk kami
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-3xl border border-white/10 bg-white/10 p-7 text-left backdrop-blur-sm shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/15">
                <p className="text-sm leading-7 text-amber-50">“{item.quote}”</p>
                <div className="mt-6">
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-sm text-amber-200">{item.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-amber-100 shadow-[0_20px_60px_rgba(201,122,45,0.16)] transition-all duration-300 ease-out hover:shadow-[0_24px_70px_rgba(201,122,45,0.2)]">
            <Image
              src="/design bg/1.png"
              alt="Latar belakang produk Getuk Gondok"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-950/80 via-amber-900/70 to-orange-800/70" />

            <div className="relative z-10 px-6 py-12 text-center sm:px-10 lg:px-16">
              <p className="text-sm font-medium tracking-[0.2em] text-amber-200 uppercase">Siap memesan?</p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight text-white">
                Jadikan momen Anda lebih istimewa dengan oleh-oleh autentik dari Getuk Gondok.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-amber-50">
                Hubungi kami untuk pemesanan khusus, hampers, maupun kebutuhan acara besar dengan desain kemasan yang elegan.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/catalogue" className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-400">
                  Pilih Produk Sekarang
                </Link>
                <Link href="/about-us" className="inline-flex items-center justify-center rounded-full border border-amber-200/70 px-6 py-3 text-sm font-semibold text-amber-50 transition hover:bg-white/10">
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={toggleBackgroundAudio}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-amber-200 bg-white/90 px-4 py-3 text-sm font-semibold text-amber-900 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white"
      >
        <span className={`h-2.5 w-2.5 rounded-full ${isAudioPlaying ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
        <span>GETHUK {isAudioPlaying ? "• On" : "• Off"}</span>
      </button>

      <audio ref={audioRef} src="/audio/GETHUK - Asale Saka Telo - Karaoke Keroncong Jawa Nada Pria dan Wanita - Purwaka Musik (128k).wav" loop preload="auto" />

      <Footer />

    </div>
  );
}