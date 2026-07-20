"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoggedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to be loaded
    if (!isLoaded) return;

    // If user is not logged in, redirect to login page
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    // If user is logged in but not an admin, redirect to error page
    if (user && user.role !== "ADMIN") {
      router.replace("/error");
      return;
    }
  }, [isLoaded, isLoggedIn, user, router]);

  // Show a polished loading state while checking access or redirecting.
  if (!isLoaded || !isLoggedIn || (user && user.role !== "ADMIN")) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f5f1] px-5">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute -bottom-32 -left-28 h-96 w-96 rounded-full bg-orange-200/25 blur-3xl" />
        <div className="admin-tab-enter relative flex w-full max-w-sm flex-col items-center rounded-[28px] border border-white bg-white/85 p-9 text-center shadow-[0_24px_70px_rgba(75,45,23,0.12)] backdrop-blur-xl">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 shadow-sm ring-1 ring-amber-100">
            <Image src="/logo/13.png" alt="Getuk Gondok" width={68} height={68} priority className="h-16 w-16 object-contain" />
          </span>
          <h1 className="mt-6 font-serif text-2xl font-semibold text-stone-900">Memverifikasi akses</h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">Mohon tunggu, kami sedang menyiapkan ruang kerja admin Anda.</p>
          <div className="mt-7 h-1.5 w-40 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full w-1/2 animate-[admin-loading_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-amber-700 to-amber-500" />
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
