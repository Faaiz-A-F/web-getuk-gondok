"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, Settings, ShoppingCart } from "lucide-react";

export function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const { user, isLoggedIn, logout } = useAuth();
    
  return (
   <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-amber-100">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between items-center h-20">
               <Link href="/" className="flex-shrink-0 flex items-center gap-4 cursor-pointer">
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
               </Link>
   
               <div className="hidden md:flex items-center gap-6">
                 <Link href="/catalogue" className="text-gray-600 hover:text-amber-700 font-medium transition">
                   Katalog
                 </Link>
                 <Link href="/about-us" className="text-gray-600 hover:text-amber-700 font-medium transition">
                   Tentang Kami
                 </Link>
                 
                 {/* Cart Icon */}
                 <Link href="/cart" className="p-2 text-gray-600 hover:text-amber-700 transition relative">
                   <ShoppingCart className="w-6 h-6" />
                 </Link>

                 {/* Auth Section */}
                 {isLoggedIn ? (
                   <div className="relative">
                     <button 
                       onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                       className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-amber-50 transition"
                     >
                       <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                         {user?.name?.charAt(0).toUpperCase() || 'U'}
                       </div>
                     </button>

                     {/* Account Dropdown Menu */}
                     {accountMenuOpen && (
                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                         <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 text-gray-700 font-medium">
                           <User className="w-4 h-4" />
                           My Account
                         </Link>
                         <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 text-gray-700 font-medium">
                           <Settings className="w-4 h-4" />
                           Settings
                         </Link>
                         <div className="border-t border-gray-200 my-2"></div>
                      <button 
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                       </div>
                     )}
                   </div>
                 ) : (
                   <div className="flex items-center gap-3">
                     <Link href="/login" className="px-4 py-2.5 text-amber-700 hover:text-amber-900 font-semibold transition">
                       Login
                     </Link>
                     <Link href="/register" className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                       Sign Up
                     </Link>
                   </div>
                 )}
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
               <Link href="/catalogue" className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-50 text-gray-700 font-medium">Katalog</Link>
               <Link href="/about-us" className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-50 text-gray-700 font-medium">
                 Tentang Kami
               </Link>
               <Link href="/cart" className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-50 text-gray-700 font-medium flex items-center gap-2">
                 <ShoppingCart className="w-4 h-4" />
                 Keranjang
               </Link>
               <div className="border-t border-gray-200 my-2"></div>
               
               {/* Mobile Auth Section */}
               {isLoggedIn ? (
                 <>
                   <Link href="/account" className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-50 text-gray-700 font-medium flex items-center gap-2">
                     <User className="w-4 h-4" />
                     Akun Saya
                   </Link>
                   <button 
                     onClick={() => {
                       logout();
                       setMenuOpen(false);
                     }}
                     className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-medium flex items-center gap-2"
                   >
                     <LogOut className="w-4 h-4" />
                     Logout
                   </button>
                 </>
               ) : (
                 <>
                   <Link href="/login" className="w-full text-center px-4 py-3 rounded-lg border-2 border-amber-700 text-amber-700 font-semibold hover:bg-amber-50">
                     Login
                   </Link>
                   <Link href="/register" className="w-full mt-2 px-4 py-3 bg-amber-700 text-white rounded-lg font-semibold text-center hover:bg-amber-800">
                     Sign Up
                   </Link>
                 </>
               )}
             </div>
           )}
         </nav>
  );
}