'use client';

import { useState } from 'react';
import MagelangImage from '../../assets/images/magelang fiks.png';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8E8BD]">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="relative min-h-screen">
          <div className="hidden lg:block fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src={MagelangImage.src}
              alt="Magelang"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="relative z-10 grid min-h-screen grid-cols-1 items-center">
            <div className="flex items-center justify-center w-full py-6 sm:py-8 lg:py-0">
              <div className="w-full max-w-md bg-[#F7F7F5] rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
                {/* Logo Icon - User Avatar Style */}
                <div className="flex justify-center mb-8">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    {/* Background Circle */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D29A2A] to-[#C87536] opacity-90"></div>

                    {/* User Icon */}
                    <svg className="w-10 h-10 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      {/* Head */}
                      <circle cx="12" cy="8" r="4" />
                      {/* Body + Additional user shape */}
                      <path d="M12 14c-4 0-6 2-6 4v4h12v-4c0-2-2-4-6-4z" />
                    </svg>
                  </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl font-bold text-[#4A1D0B] text-center mb-2 leading-tight">
                  Welcome Back
                </h1>

                {/* Subheading */}
                <p className="text-center text-sm text-[#8B6F47] mb-8 max-w-xs mx-auto">
                  Masuk untuk melanjutkan ke dashboard
                </p>

                {/* Form */}
                <form className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-[#4A1D0B] mb-2 uppercase tracking-wide">
                      Email
                    </label>
                    <div className="relative flex items-center">
                      <svg className="absolute left-4 w-5 h-5 text-[#C87536]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        className="w-full h-12 pl-12 pr-4 border-2 border-[#E8D4C4] rounded-lg focus:outline-none focus:border-[#C87536] focus:ring-2 focus:ring-[#C87536] focus:ring-opacity-30 transition-all duration-200 bg-white text-[#4A1D0B] placeholder-[#A0826D] text-sm"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
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
                        placeholder="Password"
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

                  {/* Remember me & Forgot Password */}
                  <div className="flex flex-col items-start gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#C87536] cursor-pointer rounded border-2 border-[#E8D4C4]"
                      />
                      <span className="text-sm text-[#4A1D0B] leading-none">Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[#C87536] hover:text-[#A85E2E] font-semibold transition-colors duration-200"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#C87536] text-white font-bold rounded-xl hover:bg-[#A85E2E] active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg text-base mt-8"
                  >
                    Masuk
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-[#E8D4C4]"></div>
                  <span className="text-xs text-[#A0826D]">atau</span>
                  <div className="flex-1 h-px bg-[#E8D4C4]"></div>
                </div>

                {/* Sign up Link */}
                <div className="text-center text-xs text-[#4A1D0B]">
                  Belum punya akun?{' '}
                  <a
                    href="#"
                    className="text-[#C87536] font-bold hover:text-[#A85E2E] transition-colors duration-200"
                  >
                    Daftar
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