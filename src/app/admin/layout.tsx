import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Admin sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        {/* Admin navigation will go here */}
      </aside>
      
      <main className="flex-1 bg-gray-100 p-8">
        {children}
      </main>
    </div>
  );
}
