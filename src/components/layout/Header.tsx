import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";

export function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    
  return (
   <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-amber-100">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between items-center h-20">
               <div className="flex-shrink-0 flex items-center gap-4 cursor-pointer">
                 <div className="bg-transparent p-1 rounded-xl">
                   <Image
                     src="/logo/13.png"
                     alt="Getuk Gondok Logo"
                     width={64}
                     height={64}
                     className="w-16 h-16 sm:w-16 sm:h-16 object-contain"
                   />
                 </div>
                 <div>
                   <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">Getuk Gondok</h1>
                   <p className="text-xs text-amber-600 font-medium tracking-wide uppercase">Hj. Sri Rahayu</p>
                 </div>
               </div>
   
               <div className="hidden md:flex items-center gap-6">
                 <Link href="/catalogue" className="text-gray-600 hover:text-amber-700 font-medium transition">
                   Katalog
                 </Link>
                 <Link href="/about-us" className="text-gray-600 hover:text-amber-700 font-medium transition">
                   Tentang Kami
                 </Link>
                 <div className="h-6 w-px bg-gray-200"></div>
                 <button className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                   Pesan Sekarang
                 </button>
               </div>
   
               <div className="md:hidden">
                 <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-amber-900 focus:outline-none">
                   <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     {menuOpen ? (
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     ) : (
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                     )}
                   </svg>
                 </button>
               </div>
             </div>
           </div>
   
           {menuOpen && (
             <div className="md:hidden absolute top-20 right-0 left-0 bg-white shadow-xl border-t border-amber-100 py-4 px-4 flex flex-col gap-2">
               <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-50 text-gray-700 font-medium">Katalog</button>
               <Link href="/about-us" className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-50 text-gray-700 font-medium">
                 Tentang Kami
               </Link>
               <button className="w-full mt-2 px-4 py-3 bg-amber-700 text-white rounded-lg font-semibold text-center">
                 Pesan Sekarang
               </button>
             </div>
           )}
         </nav>
  );
}