import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="brand-site min-h-screen bg-[#f8f6f2]">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <Link href="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-amber-800"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
        <div className="mt-7 rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_16px_50px_rgba(70,44,24,0.07)] sm:p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><ShieldCheck className="h-6 w-6" /></span>
          <h1 className="mt-5 font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">{title}</h1>
          <p className="mt-3 leading-7 text-stone-500">{intro}</p>
          <div className="mt-8 space-y-7 text-sm leading-7 text-stone-600">{children}</div>
          <p className="mt-9 border-t border-stone-100 pt-5 text-xs text-stone-400">Terakhir diperbarui: 20 Juli 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="mb-2 text-lg font-bold text-stone-900">{title}</h2><div>{children}</div></section>;
}
