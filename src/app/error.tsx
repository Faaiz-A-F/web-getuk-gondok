'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RefreshCw, TriangleAlert } from 'lucide-react';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-5 py-12 text-center">
      <div className="w-full max-w-md rounded-[28px] border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(74,45,23,0.1)]">
        <Image src="/logo/13.png" alt="" width={72} height={72} className="mx-auto h-18 w-18 object-contain" />
        <span className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600"><TriangleAlert className="h-6 w-6" /></span>
        <h1 className="mt-5 font-serif text-3xl font-semibold text-stone-900">Terjadi kendala</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">Data belum dapat ditampilkan. Silakan coba kembali atau kembali ke halaman utama.</p>
        <button type="button" onClick={reset} className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-800 text-sm font-bold text-white transition hover:bg-amber-900"><RefreshCw className="h-4 w-4" /> Coba kembali</button>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-stone-500 hover:text-amber-800">Kembali ke beranda</Link>
      </div>
    </main>
  );
}
