import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f6f2] px-5 py-12 text-center">
      <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="relative max-w-lg">
        <Image src="/logo/13.png" alt="" width={96} height={96} className="mx-auto h-24 w-24 object-contain opacity-90" />
        <p className="mt-4 text-sm font-extrabold uppercase tracking-[0.28em] text-amber-700">404</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-stone-900 sm:text-5xl">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-stone-500">Tautan mungkin sudah berubah atau halaman yang Anda cari tidak tersedia.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-800 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-amber-900"><ArrowLeft className="h-4 w-4" /> Ke beranda</Link>
          <Link href="/catalogue" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 text-sm font-bold text-stone-700 transition hover:border-amber-300 hover:bg-amber-50"><Search className="h-4 w-4" /> Jelajahi katalog</Link>
        </div>
      </div>
    </main>
  );
}
