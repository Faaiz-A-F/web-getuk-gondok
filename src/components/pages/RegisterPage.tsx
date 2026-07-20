'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import MagelangImage from '../../assets/images/magelang fiks.png';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (id === 'phone') {
      let phone = value.replace(/\s|-/g, '');
      if (phone && !phone.startsWith('+62')) {
        if (phone.startsWith('62')) phone = `+${phone}`;
        else if (phone.startsWith('0')) phone = `+62${phone.slice(1)}`;
        else if (/^\d+$/.test(phone)) phone = `+62${phone}`;
      }
      setFormData((current) => ({ ...current, phone }));
      return;
    }
    setFormData((current) => ({ ...current, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!/^\+62[0-9]{8,14}$/.test(formData.phone)) {
      setError('Gunakan nomor Indonesia yang valid, contoh +6281234567890.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Alamat wajib diisi.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi kata sandi belum sesuai.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Kata sandi minimal terdiri dari 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone,
          address: formData.address.trim(),
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Pendaftaran belum berhasil. Silakan coba kembali.');
        return;
      }
      router.push('/login?registered=true');
    } catch {
      setError('Tidak dapat terhubung. Periksa koneksi Anda lalu coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10';
  const fields = [
    { id: 'name', label: 'Nama lengkap', type: 'text', placeholder: 'Nama lengkap Anda', icon: UserRound, autoComplete: 'name' },
    { id: 'email', label: 'Alamat email', type: 'email', placeholder: 'nama@email.com', icon: Mail, autoComplete: 'email' },
    { id: 'phone', label: 'Nomor WhatsApp', type: 'tel', placeholder: '+6281234567890', icon: Phone, autoComplete: 'tel' },
  ] as const;

  return (
    <main className="min-h-screen bg-[#f6f1e8] lg:grid lg:grid-cols-[40%_60%]">
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <Image src={MagelangImage} alt="Pemandangan Magelang" fill priority sizes="40vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#241208]/30 via-[#2f190d]/35 to-[#241208]/90" />
        <Link href="/" className="absolute left-10 top-10 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-12">
          <div className="mb-6 h-px w-14 bg-amber-400" />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Menjadi bagian dari kami</p>
          <h2 className="mt-3 max-w-lg font-serif text-4xl font-semibold leading-tight">Pesan hidangan tradisional dengan lebih mudah.</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/75">Simpan profil, pantau pesanan, dan temukan pilihan Getuk Gondok favorit Anda.</p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-200/35 blur-3xl" />
        <Link href="/" aria-label="Kembali ke beranda" className="absolute left-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-700 shadow-sm lg:hidden">
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="mb-7 text-center">
            <Link href="/" className="mb-4 inline-flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-stone-200/70">
                <Image src="/logo/13.png" alt="" width={50} height={50} className="h-12 w-12 object-contain" />
              </span>
              <span className="text-left">
                <span className="block text-base font-extrabold text-[#422414]">Getuk Gondok</span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-amber-700">Hj. Sri Rahayu</span>
              </span>
            </Link>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900">Buat akun baru</h1>
            <p className="mt-2 text-sm text-stone-500">Lengkapi data berikut untuk memulai.</p>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_24px_70px_rgba(75,45,23,0.12)] backdrop-blur-xl sm:p-8">
            {error && <div role="alert" aria-live="polite" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map(({ id, label, icon: Icon, ...field }) => (
                  <div key={id} className={id === 'name' ? 'sm:col-span-2' : ''}>
                    <label htmlFor={id} className="mb-2 block text-sm font-semibold text-stone-700">{label}</label>
                    <div className="relative">
                      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400" />
                      <input id={id} name={id} value={formData[id]} onChange={handleChange} required className={inputClass} {...field} />
                    </div>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="mb-2 block text-sm font-semibold text-stone-700">Alamat</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-3.5 h-[18px] w-[18px] text-stone-400" />
                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={2} required autoComplete="street-address" placeholder="Alamat lengkap untuk data pemesanan" className="w-full resize-none rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
                  </div>
                </div>
                {(['password', 'confirmPassword'] as const).map((id) => {
                  const confirm = id === 'confirmPassword';
                  const visible = confirm ? showConfirmPassword : showPassword;
                  return (
                    <div key={id}>
                      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-stone-700">{confirm ? 'Konfirmasi kata sandi' : 'Kata sandi'}</label>
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400" />
                        <input id={id} name={id} type={visible ? 'text' : 'password'} value={formData[id]} onChange={handleChange} minLength={6} required autoComplete={confirm ? 'new-password' : 'new-password'} placeholder="Minimal 6 karakter" className={`${inputClass} pr-12`} />
                        <button type="button" onClick={() => confirm ? setShowConfirmPassword((v) => !v) : setShowPassword((v) => !v)} aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700">
                          {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-stone-50 p-3 text-xs leading-5 text-stone-600">
                <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-amber-800" />
                <span>Saya menyetujui <Link href="/terms" className="font-bold text-amber-800 hover:underline">Syarat & Ketentuan</Link> dan <Link href="/privacy" className="font-bold text-amber-800 hover:underline">Kebijakan Privasi</Link>.</span>
              </label>

              <button type="submit" disabled={loading} className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8a4b20] text-sm font-bold text-white shadow-lg shadow-amber-900/15 transition hover:-translate-y-0.5 hover:bg-[#713b18] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" /> Memproses...</> : <>Buat akun <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-500">Sudah memiliki akun? <Link href="/login" className="font-bold text-amber-800 hover:text-amber-950">Masuk di sini</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
