"use client";

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
      router.push("/login");
      return;
    }

    // If user is logged in but not an admin, redirect to error page
    if (user && user.role !== "ADMIN") {
      router.push("/error");
      return;
    }
  }, [isLoaded, isLoggedIn, user, router]);

  // Show nothing while checking auth or redirecting
  if (!isLoaded || !isLoggedIn || (user && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-amber-800 font-medium">Checking access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
