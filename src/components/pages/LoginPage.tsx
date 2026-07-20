'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import MagelangImage from '../../assets/images/magelang fiks.png';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, setSessionId } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Email atau kata sandi tidak sesuai.');
        setLoading(false);
        return;
      }

      if (data.sessionId) setSessionId(data.sessionId);
      setUser(data.user);
      router.push(data.user.role === 'ADMIN' ? '/admin' : '/');
    } catch {
      setError('Tidak dapat terhubung. Periksa koneksi Anda lalu coba lagi.');
      setLoading(false);
    }
  };

  const inputClass =
    'h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10';

  return (
    <main className="min-h-screen bg-[#f6f1e8] lg:grid lg:grid-cols-[46%_54%]">
      <section className="relative hidden min-h-screen overflow-hidden lg:block" aria-label="Tentang Getuk Gondok">
        <Image
          src={MagelangImage}
          alt="Pemandangan Magelang, rumah Getuk Gondok Hj. Sri Rahayu"
          fill
          priority
          sizes="46vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#241208]/35 via-[#2f190d]/30 to-[#241208]/90" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-10 xl:p-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke beranda
          </Link>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
            Khas Magelang
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-12">
          <div className="mb-6 h-px w-14 bg-amber-400" />
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
            Warisan rasa sejak 1985
          </p>
          <h2 className="brand-heading max-w-xl font-serif text-4xl font-semibold leading-tight xl:text-5xl">
            Rasa tradisional yang selalu membawa pulang kenangan.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/75">
            Dibuat dengan resep keluarga dan bahan pilihan untuk menghadirkan getuk autentik dari jantung Magelang.
          </p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />

        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="absolute left-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-amber-800 sm:left-8 sm:top-8 lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="relative z-10 w-full max-w-[440px]">
          <div className="mb-8 flex flex-col items-center text-center sm:mb-9">
            <Link href="/" className="mb-5 inline-flex items-center gap-3" aria-label="Getuk Gondok - beranda">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_10px_35px_rgba(88,51,25,0.12)] ring-1 ring-stone-200/70">
                <Image src="/logo/13.png" alt="" width={56} height={56} className="h-14 w-14 object-contain" />
              </span>
              <span className="text-left">
                <span className="block text-lg font-extrabold tracking-tight text-[#422414]">Getuk Gondok</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Hj. Sri Rahayu</span>
              </span>
            </Link>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Sugeng rawuh
            </h1>
            <p className="mt-2.5 text-sm leading-6 text-stone-500">
              Masuk untuk melanjutkan belanja dan melihat pesanan Anda.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_24px_70px_rgba(75,45,23,0.12)] backdrop-blur-xl sm:p-8">
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-stone-700">
                  Alamat email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-stone-700">
                    Kata sandi
                  </label>
                  <span className="text-xs font-medium text-stone-400">Min. 6 karakter</span>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    minLength={6}
                    required
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    aria-pressed={showPassword}
                    className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-stone-300 accent-amber-800"
                  />
                  Ingat saya
                </label>
                <button type="button" className="text-sm font-semibold text-amber-800 transition hover:text-amber-950">
                  Lupa kata sandi?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8a4b20] px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(138,75,32,0.24)] transition hover:-translate-y-0.5 hover:bg-[#713b18] hover:shadow-[0_14px_30px_rgba(113,59,24,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk ke akun
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-stone-200" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Belum punya akun?</span>
              <span className="h-px flex-1 bg-stone-200" />
            </div>

            <Link
              href="/register"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-stone-300 bg-white text-sm font-bold text-stone-700 transition hover:border-amber-700 hover:bg-amber-50/60 hover:text-amber-900"
            >
              Buat akun baru
            </Link>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-stone-500">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            Data Anda terlindungi dan tidak dibagikan.
          </p>
        </div>
      </section>
    </main>
  );
}
