"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, User, LogOut, Settings, History } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function HeaderLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand - Always Visible */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
            <div className="bg-transparent p-1 rounded-xl">
              <Image
                src="/logo/13.png"
                alt="Getuk Gondok Logo"
                width={64}
                height={64}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">Getuk Gondok</h1>
              <p className="text-xs text-amber-600 font-medium tracking-wide uppercase">Hj. Sri Rahayu</p>
            </div>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-amber-900 transition hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-20 right-0 w-72 sm:w-80 bg-white shadow-2xl border border-amber-100 rounded-bl-2xl rounded-br-2xl overflow-hidden transition-all duration-300 ease-out origin-top-right ${
          menuOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-4 px-2">
          {/* Navigation Links */}
          <div className="space-y-1">
            <Link
              href="/catalogue"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-800 font-medium transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <span>Katalog</span>
            </Link>

            <Link
              href="/about-us"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-800 font-medium transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Tentang Kami</span>
            </Link>

            <Link
              href="/cart"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-800 font-medium transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-amber-700" />
              </div>
              <span>Keranjang</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="my-4 mx-4 border-t border-gray-200" />

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="space-y-1">
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">Selamat datang!</p>
                </div>
              </div>

              <Link
                href="/account"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-800 font-medium transition-all duration-200"
              >
                <User className="w-5 h-5" />
                <span>Akun Saya</span>
              </Link>

              <Link
                href="/account?tab=orders"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-800 font-medium transition-all duration-200"
              >
                <History className="w-5 h-5" />
                <span>Riwayat Pemesanan</span>
              </Link>

              <Link
                href="/account"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-800 font-medium transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
                <span>Pengaturan</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 px-2">
              <Link
                href="/login"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-3 rounded-xl border-2 border-amber-600 text-amber-700 font-semibold hover:bg-amber-50 transition-all duration-200"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Daftar Sekarang
              </Link>
            </div>
          )}
        </div>

        {/* Decorative Footer */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-3">
          <p className="text-xs text-amber-700 text-center font-medium">
            ✦ Olahan Tradisional Sejak 1985 ✦
          </p>
        </div>
      </div>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={closeMenu}
          onKeyDown={(e) => e.key === "Escape" && closeMenu()}
        />
      )}
    </nav>
  );
}
