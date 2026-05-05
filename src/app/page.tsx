"use client";

import Image from "next/image";
import { useState, useContext } from "react";
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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(new Set<string>());

  const { addItem } = useContext(CartContext) || {};
  
  const categories = ["All", "Traditional", "Premium", "Box", "Serving", "Combo", "Sweet", "Special", "Deluxe"];
  
  const filteredProducts = products
    .filter(p => selectedCategory === "All" || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));

  const toggleProduct = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const selectAll = () => {
    const allIds = new Set(filteredProducts.map(p => p.id));
    setSelectedProducts(allIds);
  };

  const clearAll = () => {
    setSelectedProducts(new Set());
  };

  const addSelectedToCart = () => {
    selectedProducts.forEach(id => {
      const product = products.find(p => p.id === id);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
                Getuk Gondok
              </h1>
              <p className="text-xs text-amber-600 font-semibold">Hj. Sri Rahayu</p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button className="px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold transition transform hover:scale-105">
                Pesan Sekarang
              </button>
              <button className="px-6 py-2 border-2 border-amber-700 text-amber-700 hover:bg-amber-50 rounded-lg font-semibold transition">
                Transaksi
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 focus:outline-none"
              >
                <div className="w-8 h-8 flex flex-col justify-center gap-1.5">
                  <div className={`w-full h-1 bg-amber-900 rounded transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                  <div className={`w-full h-1 bg-amber-900 rounded transition-all ${menuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-full h-1 bg-amber-900 rounded transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </div>
              </button>

              {/* Mobile Dropdown Menu */}
              {menuOpen && (
                <div className="absolute top-20 right-0 left-0 bg-white shadow-lg border-t-4 border-amber-700">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-6 py-4 hover:bg-amber-50 text-amber-900 font-semibold border-b border-amber-100"
                  >
                    Pesan Sekarang
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-6 py-4 hover:bg-amber-50 text-amber-900 font-semibold"
                  >
                    Transaksi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-900 tracking-tight">
              Getuk Gondok
            </h1>
            <p className="text-xl sm:text-2xl text-amber-700 font-semibold">
              Hj. Sri Rahayu
            </p>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Oleh-Oleh Khas Magelang | Sejak 1985
            </p>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Nikmati kelezatan autentik Getuk Gondok dengan resep tradisional yang telah dipercaya selama lebih dari 30 tahun. Setiap produk dibuat dengan bahan pilihan dan sentuhan cinta untuk keluarga Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="px-8 py-3 border-2 border-amber-700 text-amber-700 hover:bg-amber-50 rounded-lg font-semibold transition">
                Lihat Katalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured 3D Products Section */}
      <section className="bg-gradient-to-r from-amber-100 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-12 text-center">Produk Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { id: 1, image: "/products/1_20260404_090954_0000.png", name: "Tumpeng Hias Premium" },
              { id: 2, image: "/products/2_20260404_090954_0001.png", name: "Tumpeng Hiasan Luxury" },
              { id: 3, image: "/products/3_20260404_090954_0002.png", name: "Nampan Specialty" },
              { id: 4, image: "/products/16_20260403_214751_0009.png", name: "Tampah Large" },
              { id: 5, image: "/products/20_20260403_214751_0013.png", name: "Nampan Deluxe" },
            ].map((product) => (
              <div
                key={product.id}
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-white font-bold text-lg">{product.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-amber-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-amber-100 text-sm mb-1">WhatsApp</p>
              <p className="text-2xl font-bold">085643730540</p>
            </div>
            <div>
              <p className="text-amber-100 text-sm mb-1">Instagram</p>
              <p className="text-xl font-semibold">@getukkondok</p>
            </div>
            <div>
              <p className="text-amber-100 text-sm mb-1">TikTok</p>
              <p className="text-xl font-semibold">@getukkondok_magelang</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Kategori Produk</h2>
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? "bg-amber-700 text-white"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 overflow-hidden"
            >
              <div className="relative w-full h-48 bg-gray-200">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-amber-900 mt-3">{product.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Getuk Gondok</h3>
              <p className="text-amber-100">Penghasil Oleh-Oleh Khas Magelang Terpercaya</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hubungi Kami</h4>
              <p className="text-amber-100">WhatsApp: 085643730540</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ikuti Kami</h4>
              <p className="text-amber-100">Instagram: @getukkondok</p>
              <p className="text-amber-100">TikTok: @getukkondok_magelang</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Lokasi</h4>
              <p className="text-amber-100">Magelang, Jawa Tengah</p>
              <p className="text-amber-100">Sejak 1985</p>
            </div>
          </div>
          <div className="border-t border-white pt-8">
            <p className="text-center text-amber-100">
              © 2026 Getuk Gondok. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
