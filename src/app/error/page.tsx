import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LogIn, ShieldX } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f6f2] px-5 py-12 text-center">
      <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="relative w-full max-w-md rounded-[28px] border border-white bg-white/90 p-8 shadow-[0_24px_70px_rgba(75,45,23,0.12)] backdrop-blur-xl">
        <Image src="/logo/13.png" alt="Getuk Gondok" width={72} height={72} priority className="mx-auto h-18 w-18 object-contain" />
        <span className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100"><ShieldX className="h-7 w-7" /></span>
        <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.22em] text-red-600">Akses terbatas</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-stone-900">Anda tidak memiliki izin</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">Halaman ini hanya dapat diakses oleh akun dengan hak yang sesuai.</p>
        <div className="mt-7 space-y-3">
          <Link href="/" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-800 text-sm font-bold text-white transition hover:bg-amber-900"><ArrowLeft className="h-4 w-4" /> Kembali ke beranda</Link>
          <Link href="/login" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white text-sm font-bold text-stone-700 transition hover:bg-stone-50"><LogIn className="h-4 w-4" /> Masuk dengan akun lain</Link>
        </div>
      </div>
    </main>
  );
}
