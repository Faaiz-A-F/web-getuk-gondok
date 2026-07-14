"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * /orders — Redirects to /account?tab=orders.
 * The order history UI lives inside AccountPage to keep a single
 * profile/account surface; this route is preserved for backward
 * compatibility with any links pointing here.
 */
export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account?tab=orders");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF3E8]">
      <div className="flex flex-col items-center gap-3 text-[#8B6F47]">
        <Loader2 className="w-10 h-10 animate-spin text-[#C87536]" />
        <p className="text-sm font-medium">Mengalihkan ke Riwayat Pesanan...</p>
      </div>
    </div>
  );
}
