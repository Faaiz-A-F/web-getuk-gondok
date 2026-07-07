'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MagelangImage from '../../assets/images/magelang fiks.png';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Handle phone number - auto-add +62 prefix
    if (id === 'phone') {
      let phoneValue = value;
      // If user starts typing without +62, add it
      if (phoneValue && !phoneValue.startsWith('+62')) {
        if (phoneValue.startsWith('62')) {
          phoneValue = '+' + phoneValue;
        } else if (phoneValue.startsWith('0')) {
          phoneValue = '+62' + phoneValue.slice(1);
        } else if (phoneValue.match(/^\d+$/)) {
          phoneValue = '+62' + phoneValue;
        }
      }
      setFormData({ ...formData, phone: phoneValue });
      return;
    }
    
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate phone number - must start with +62
    if (!formData.phone || !formData.phone.startsWith('+62')) {
      setError('Nomor telepon harus diawali dengan +62');
      return;
    }

    // Validate phone number format (should be +62 followed by digits)
    const phoneRegex = /^\+62[0-9]{8,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Format nomor telepon tidak valid. Contoh: +6281234567890');
      return;
    }

    // Validate email - must be @gmail.com
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      setError('Email harus menggunakan domain @gmail.com');
      return;
    }

    // Validate address - must not be empty
    if (!formData.address.trim()) {
      setError('Alamat harus diisi');
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Registration successful, redirect to login
      router.push('/login?registered=true');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8E8BD]">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="relative min-h-screen">
          <div className="hidden lg:block fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <Image
              src={MagelangImage}
              alt="Magelang"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          <div className="relative z-10 grid min-h-screen grid-cols-1 items-center">
            <div className="flex items-center justify-center w-full py-8 sm:py-10 lg:py-0">
              <div className="w-full max-w-md bg-[#F7F7F5] rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
                {/* Logo Icon */}
                <div className="flex justify-center mb-8">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D29A2A] to-[#C87536] opacity-90"></div>
                    <svg className="w-10 h-10 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                    </svg>
                  </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl font-bold text-[#4A1D0B] text-center mb-2 leading-tight">
                  Ndamel Akun
                </h1>
                <p className="text-center text-sm text-[#8B6F47] mb-8 max-w-xs mx-auto">
                  Daftar kagem mlebet dhateng website
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-[#4A1D0B] mb-2 uppercase tracking-wide">
                      Nama Lengkap
                    </label>
                    <div className="relative flex items-center">
                      <svg className="absolute left-4 w-5 h-5 text-[#C87536]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                      </svg>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nama Lengkap"
                        required
                        className="w-full h-12 pl-12 pr-4 border-2 border-[#E8D4C4] rounded-lg focus:outline-none focus:border-[#C87536] focus:ring-2 focus:ring-[#C87536] focus:ring-opacity-30 transition-all duration-200 bg-white text-[#4A1D0B] placeholder-[#A0826D] text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-[#4A1D0B] mb-2 uppercase tracking-wide">
                      Email <span className="text-[#C87536]">(@gmail.com)</span>
                    </label>
                    <div className="relative flex items-center">
                      <svg className="absolute left-4 w-5 h-5 text-[#C87536]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contoh@gmail.com"
                        required
                        className="w-full h-12 pl-12 pr-4 border-2 border-[#E8D4C4] rounded-lg focus:outline-none focus:border-[#C87536] focus:ring-2 focus:ring-[#C87536] focus:ring-opacity-30 transition-all duration-200 bg-white text-[#4A1D0B] placeholder-[#A0826D] text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-[#4A1D0B] mb-2 uppercase tracking-wide">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-[#C87536] font-semibold">+62</span>
                      <svg className="absolute left-12 w-5 h-5 text-[#C87536]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.95 1.57l.57 2.28a2 2 0 01-.4 1.82L8.5 11.5a16 16 0 006.99 6.99l1.88-1.9a2 2 0 011.82-.4l2.28.57A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.82 23 1 14.18 1 3V2a2 2 0 012-2h2z" />
                      </svg>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone.replace(/^\+62/, '')}
                        onChange={handleChange}
                        placeholder="81234567890"
                        required
                        className="w-full h-12 pl-20 pr-4 border-2 border-[#E8D4C4] rounded-lg focus:outline-none focus:border-[#C87536] focus:ring-2 focus:ring-[#C87536] focus:ring-opacity-30 transition-all duration-200 bg-white text-[#4A1D0B] placeholder-[#A0826D] text-sm"
                      />
                    </div>
                    <p className="text-xs text-[#8B6F47] mt-1">Contoh: 81234567890</p>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-xs font-semibold text-[#4A1D0B] mb-2 uppercase tracking-wide">
                      Alamat <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-3 w-5 h-5 text-[#C87536]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <textarea
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Jl. Contoh No. 1, Kota, Provinsi"
                        required
                        rows={3}
                        className="w-full px-4 py-3 pl-12 border-2 border-[#E8D4C4] rounded-lg focus:outline-none focus:border-[#C87536] focus:ring-2 focus:ring-[#C87536] focus:ring-opacity-30 transition-all duration-200 bg-white text-[#4A1D0B] placeholder-[#A0826D] text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-[#4A1D0B] mb-2 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <svg className="absolute left-4 w-5 h-5 text-[#C87536]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        minLength={6}
                        className="w-full h-12 pl-12 pr-12 border-2 border-[#E8D4C4] rounded-lg focus:outline-none focus:border-[#C87536] focus:ring-2 focus:ring-[#C87536] focus:ring-opacity-30 transition-all duration-200 bg-white text-[#4A1D0B] placeholder-[#A0826D] text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-[#C87536] hover:text-[#A85E2E] transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.81-2.89 3.69-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm5.31-7.78l3.15 3.15.02-.02c-.8-.46-1.63-.85-2.5-1.09l-.67-.04z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[#4A1D0B] mb-2 uppercase tracking-wide">
                      Konfirmasi Password
                    </label>
                    <div className="relative flex items-center">
                      <svg className="absolute left-4 w-5 h-5 text-[#C87536]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Konfirmasi Password"
                        required
                        className="w-full h-12 pl-12 pr-12 border-2 border-[#E8D4C4] rounded-lg focus:outline-none focus:border-[#C87536] focus:ring-2 focus:ring-[#C87536] focus:ring-opacity-30 transition-all duration-200 bg-white text-[#4A1D0B] placeholder-[#A0826D] text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 text-[#C87536] hover:text-[#A85E2E] transition-colors"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.81-2.89 3.69-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm5.31-7.78l3.15 3.15.02-.02c-.8-.46-1.63-.85-2.5-1.09l-.67-.04z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start space-x-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 w-4 h-4 accent-[#C87536] rounded border-2 border-[#E8D4C4]"
                    />
                    <span className="text-sm text-[#4A1D0B] leading-5">
                      Kula sampun maca lan sarujuk dhateng <a href="#" className="text-[#C87536] hover:text-[#A85E2E] font-semibold transition-colors duration-200">Syarat & Ketentuan</a> lan <a href="#" className="text-[#C87536] hover:text-[#A85E2E] font-semibold transition-colors duration-200">Kebijakan Privasi</a>.
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#C87536] text-white font-bold rounded-xl hover:bg-[#A85E2E] active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg text-base mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Daftar'}
                  </button>
                </form>

                {/* Sign in Link */}
                <div className="text-center text-xs text-[#4A1D0B] mt-6">
                  Sampun gadah akun?{' '}
                  <a href="/login" className="text-[#C87536] font-bold hover:text-[#A85E2E] transition-colors duration-200">
                    Mlebet Mriki
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
