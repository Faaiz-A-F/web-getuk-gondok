import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen font-sans"> // Ensure the layout takes full height and uses a sans-serif font
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
