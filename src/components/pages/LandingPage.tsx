"use client";

import Image from "next/image";
import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";

const products = [
  { id: "1", name: "Tumpeng Hias", category: "Special", image: "/products/1_20260404_090954_0000.png", price: 75000, description: "Tumpeng hias premium untuk acara spesial" },
  { id: "2", name: "Tumpeng Hiasan", category: "Premium", image: "/products/2_20260404_090954_0001.png", price: 85000, description: "Hiasan tumpeng mewah berkualitas tinggi" },
  { id: "3", name: "Nampan Specialty", category: "Deluxe", image: "/products/3_20260404_090954_0002.png", price: 95000, description: "Nampan specialty dengan desain elegan" },
  { id: "4", name: "Kardus Packaging", category: "Box", image: "/products/4_20260404_090954_0003.png", price: 15000, description: "Packaging kardus standar yang kuat" },
  { id: "5", name: "Yangko", category: "Traditional", image: "/products/7_20260403_214750_0000.png", price: 25000, description: "Kue tradisional yang lezat dan otentik" },
  { id: "6", name: "Paket Mix", category: "Combo", image: "/products/8_20260403_214750_0001.png", price: 120000, description: "Paket mix lengkap untuk berbagai kebutuhan" },
  { id: "7", name: "Tampah Set", category: "Traditional", image: "/products/9_20260403_214750_0002.png", price: 45000, description: "Set tampah tradisional asli Magelang" },
  { id: "8", name: "Kardus Kecil", category: "Box", image: "/products/10_20260403_214750_0003.png", price: 10000, description: "Kardus kecil praktis untuk pengiriman" },
  { id: "9", name: "Kardus Sedang", category: "Box", image: "/products/11_20260403_214750_0004.png", price: 15000, description: "Kardus sedang dengan kekuatan optimal" },
  { id: "10", name: "Kardus Besar", category: "Box", image: "/products/12_20260403_214750_0005.png", price: 20000, description: "Kardus besar jumbo untuk paket istimewa" },
  { id: "11", name: "Nampan Set", category: "Serving", image: "/products/13_20260403_214750_0006.png", price: 55000, description: "Set nampan elegan untuk sajian" },
  { id: "12", name: "Jongkong", category: "Traditional", image: "/products/14_20260403_214750_0007.png", price: 30000, description: "Jongkong autentik rasa istimewa" },
  { id: "13", name: "Wajik Jadah", category: "Sweet", image: "/products/15_20260403_214750_0008.png", price: 35000, description: "Wajik jadah manis legit tradisional" },
  { id: "14", name: "Tampah Large", category: "Serving", image: "/products/16_20260403_214751_0009.png", price: 65000, description: "Tampah large berkualitas super" },
  { id: "15", name: "Klepon", category: "Traditional", image: "/products/17_20260403_214751_0010.png", price: 28000, description: "Klepon kenyal segar gula merah" },
  { id: "16", name: "Tampah Extra", category: "Serving", image: "/products/18_20260403_214751_0011.png", price: 70000, description: "Tampah extra besar untuk pesta" },
  { id: "17", name: "Wingko", category: "Sweet", image: "/products/19_20260403_214751_0012.png", price: 32000, description: "Wingko babat terkenal Magelang" },
  { id: "18", name: "Nampan Deluxe", category: "Serving", image: "/products/20_20260403_214751_0013.png", price: 100000, description: "Nampan deluxe premium eksklusif" },
  { id: "19", name: "Tampah Premium", category: "Serving", image: "/products/21_20260403_214751_0014.png", price: 120000, description: "Tampah premium untuk acara besar" },
  { id: "20", name: "Kardus Jumbo", category: "Box", image: "/products/22_20260403_214751_0015.png", price: 25000, description: "Kardus jumbo tahan lama kuat" },
];

export function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(new Set<string>());

  const { addItem } = useContext(CartContext) || {};
  const categories = ["All", "Traditional", "Premium", "Box", "Serving", "Combo", "Sweet", "Special", "Deluxe"];

  const filteredProducts = products
    .filter((product) => selectedCategory === "All" || product.category === selectedCategory)
    .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));

  const toggleProduct = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const addSelectedToCart = () => {
    selectedProducts.forEach((id) => {
      const product = products.find((item) => item.id === id);
      if (product && addItem) {
        addItem({
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          quantity: 1,
          price: product.price,
        });
      }
    });
    setSelectedProducts(new Set());
  };

  const addSingleToCart = (product: any) => {
    if (addItem) {
      addItem({
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        quantity: 1,
        price: product.price,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-amber-200 selection:text-amber-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-4 cursor-pointer">
              <div className="bg-amber-100 p-2 rounded-xl">
                <Image
                  src="/logo/1_20260505_231853_0000(1).png"
                  alt="Getuk Gondok Logo"
                  width={50}
                  height={50}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">Getuk Gondok</h1>
                <p className="text-xs text-amber-600 font-medium tracking-wide uppercase">Hj. Sri Rahayu</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button className="text-gray-600 hover:text-amber-700 font-medium transition">Katalog</button>
              <button className="text-gray-600 hover:text-amber-700 font-medium transition">Tentang Kami</button>
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
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-50 text-gray-700 font-medium">Tentang Kami</button>
            <button className="w-full mt-2 px-4 py-3 bg-amber-700 text-white rounded-lg font-semibold text-center">
              Pesan Sekarang
            </button>
          </div>
        )}
      </nav>

      <section className="relative overflow-hidden bg-amber-950 text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-800 blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-orange-700 blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/50 border border-amber-700/50 text-amber-200 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Buka & Menerima Pesanan
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight">
                Kelezatan <span className="text-amber-400">Autentik</span> Sejak 1985.
              </h1>
              <p className="text-lg lg:text-xl text-amber-100/80 max-w-2xl mx-auto lg:mx-0">
                Oleh-oleh khas Magelang dengan resep warisan. Tumpeng hias, jajanan tradisional, dan hampers premium untuk momen spesial Anda.
              </p>

              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari produk kesukaanmu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 rounded-full border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-lg shadow-xl"
                />
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative w-full h-125 animate-[sway_5s_ease-in-out_infinite]">
                <Image src="/products/1_20260404_090954_0000.png" alt="Tumpeng Premium" fill className="object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8 max-w-2xl">
              <p className="text-sm font-medium tracking-[0.2em] text-neutral-500 uppercase">Kenapa Getuk Gondok?</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-[#c97a2d]">
                Bukan Sekadar Oleh-Oleh.
                <br />
                Ini Sepotong Cerita Keluarga.
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-neutral-800 max-w-xl">
                Sejak 1985, Hj. Sri Rahayu meracik getuk dengan tangan sendiri dan menggunakan singkong segar Magelang,
                kelapa muda, dan gula merah pilihan. Tidak ada jalan pintas, tidak ada bahan pengawet.
                <br />
                Kini hadir dalam berbagai pilihan kemasan modern, tetap dengan resep yang sama: autentik, lembut, dan penuh rasa.
              </p>

              <div className="grid grid-cols-3 gap-6 sm:gap-10 max-w-xl pt-2">
                <div>
                  <div className="text-3xl sm:text-4xl font-semibold text-[#d89a34]">40+</div>
                  <div className="mt-2 text-xs sm:text-sm text-neutral-600">Tahun Pengalaman</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-semibold text-[#d89a34]">10+</div>
                  <div className="mt-2 text-xs sm:text-sm text-neutral-600">Varian Produk</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-semibold text-[#d89a34]">1000+</div>
                  <div className="mt-2 text-xs sm:text-sm text-neutral-600">Pelanggan Setia</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-center">
              <div className="relative w-full max-w-55 rounded-4xl bg-[#5a2500] px-8 py-10 text-center shadow-[0_24px_60px_rgba(90,37,0,0.28)] text-[#d89a34]">
                <div className="text-3xl font-semibold tracking-[0.15em] uppercase">Since</div>
                <div className="mt-2 flex w-full justify-center text-6xl sm:text-7xl font-extrabold leading-none tabular-nums">1985</div>
                <div className="mx-auto mt-4 h-px w-20 bg-[#d89a34]/70" />
                <div className="mt-5 text-xl leading-tight text-white/95">
                  Magelang,
                  <br />
                  Jawa Tengah
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="catalog">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Katalog Produk</h2>
            <p className="text-gray-500">Temukan berbagai macam pilihan untuk acaramu.</p>
          </div>

          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 hide-scrollbar w-full md:w-auto gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-700 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300 hover:bg-amber-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const isSelected = selectedProducts.has(product.id);
            return (
              <div
                key={product.id}
                className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                  isSelected ? "border-amber-500 ring-4 ring-amber-500/20" : "border-transparent"
                }`}
              >
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-amber-800 text-xs font-bold rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  <button onClick={() => toggleProduct(product.id)} className="absolute top-4 right-4 z-10">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "bg-amber-500 border-amber-500 text-white" : "bg-white/80 border-gray-300 text-transparent hover:border-amber-400"
                    }`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-black text-amber-700">{formatPrice(product.price)}</span>
                    <button
                      onClick={() => addSingleToCart(product)}
                      className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Produk tidak ditemukan</h3>
            <p className="text-gray-500 mt-2">Coba gunakan kata kunci atau kategori lain.</p>
          </div>
        )}
      </section>

      {selectedProducts.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-amber-500 rounded-full font-bold text-sm">
                {selectedProducts.size}
              </span>
              <span className="font-medium hidden sm:inline">Produk Terpilih</span>
            </div>
            <div className="h-6 w-px bg-gray-700"></div>
            <button
              onClick={addSelectedToCart}
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-6 py-2 rounded-full font-bold transition-colors"
            >
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      )}

      <footer className="bg-amber-950 text-amber-100/70 border-t border-amber-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-1.5 rounded-lg inline-block">
                  <Image src="/logo/1_20260505_231853_0000(1).png" alt="Logo" width={40} height={40} className="object-contain" />
                </div>
                <h3 className="text-2xl font-bold text-white">Getuk Gondok</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Pusat oleh-oleh khas Magelang yang memadukan resep tradisional dengan kualitas modern sejak 1985.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hubungi Kami</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  0856 4373 0540
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Magelang, Jawa Tengah
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Sosial Media</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">@getukkondok (Instagram)</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">@getukkondok_magelang (TikTok)</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Jam Operasional</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-amber-900 pb-2"><span>Senin - Jumat</span> <span>08:00 - 20:00</span></li>
                <li className="flex justify-between border-b border-amber-900 pb-2"><span>Sabtu - Minggu</span> <span>07:00 - 21:00</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-amber-900 text-center text-sm">
            <p>© {new Date().getFullYear()} Getuk Gondok Hj. Sri Rahayu. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sway {
          0%, 100% { transform: translateX(-30px); }
          50% { transform: translateX(10px); }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
