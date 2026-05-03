import type { ReactNode } from "react";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation will go here */}
      <nav className="bg-white border-b">
        {/* Navigation component */}
      </nav>
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer will go here */}
      <footer className="bg-gray-100 border-t">
        {/* Footer component */}
      </footer>
    </div>
  );
}
