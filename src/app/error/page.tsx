"use client";

import Image from "next/image";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h1>
          <p className="text-amber-100">403 - Forbidden</p>
        </div>
        
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo/13.png"
              alt="Getuk Gondok Logo"
              width={80}
              height={80}
              className="w-20 h-20 object-contain opacity-50"
            />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Anda Tidak Memiliki Akses
          </h2>
          <p className="text-gray-600 mb-6">
            Maaf, halaman yang Anda coba akses memerlukan izin khusus. 
            Jika Anda yakin ini adalah kesalahan, silakan hubungi administrator.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Kembali ke Halaman Utama
            </Link>
            <Link
              href="/login"
              className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
            >
              Masuk dengan Akun Lain
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
