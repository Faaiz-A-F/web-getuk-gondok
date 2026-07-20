import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f1e8] px-5 py-10">
      <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="relative w-full max-w-md rounded-[28px] border border-white bg-white/85 p-7 text-center shadow-[0_24px_70px_rgba(75,45,23,0.12)] backdrop-blur-xl sm:p-9">
        <Image src="/logo/13.png" alt="Getuk Gondok" width={72} height={72} className="mx-auto h-18 w-18 object-contain" priority />
        <span className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><ShieldCheck className="h-6 w-6" /></span>
        <h1 className="mt-5 font-serif text-3xl font-semibold text-stone-900">Lupa kata sandi?</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">Untuk menjaga keamanan akun, hubungi admin melalui WhatsApp. Tim kami akan membantu memverifikasi identitas dan memulihkan akses Anda.</p>
        <a href="https://wa.me/6285643730540?text=Halo%20Admin%20Getuk%20Gondok%2C%20saya%20memerlukan%20bantuan%20untuk%20memulihkan%20akun." target="_blank" rel="noreferrer" className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-800 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-900"><MessageCircle className="h-5 w-5" /> Hubungi admin</a>
        <Link href="/login" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-amber-800"><ArrowLeft className="h-4 w-4" /> Kembali ke halaman masuk</Link>
      </div>
    </main>
  );
}
