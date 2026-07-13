"use client";

import Link from "next/link";
import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Types for database products
interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  stock: number;
  weight: number;
  isActive: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }>;
}

interface DbCategory {
  id: string;
  name: string;
  slug: string;
}

// Local product type for cart
type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  description: string;
};

type CartLine = {
  key: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

const PICKUP_OPTIONS = [
  {
    id: "rumah-produksi",
    label: "Rumah Produksi",
    address: "G643+24F, Karet, Bulurejo, Mertoyudan, Magelang Regency, Central Java 56172",
  },
  {
    id: "toko",
    label: "Toko",
    address: "Jl. Mataram No.9A, Rejowinangun Sel., Kec. Magelang Sel., Kota Magelang, Jawa Tengah 56172",
  },
] as const;

export function CataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [pickupLocation, setPickupLocation] = useState<(typeof PICKUP_OPTIONS)[number]["id"]>("rumah-produksi");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelMounted, setIsPanelMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Database state
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { addItem } = useContext(CartContext) || {};
  const { isLoggedIn, isLoaded } = useAuth();

  // Fetch products and categories from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setDbProducts(Array.isArray(productsData) ? productsData : []);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setDbCategories(Array.isArray(categoriesData) ? categoriesData : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform database products to component format
  const products: Product[] = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category.name,
    image: p.images && p.images.length > 0 
      ? (p.images.find(img => img.isPrimary)?.url || p.images[0].url) 
      : '/products/placeholder.webp',
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    description: p.description || 'Deskripsi produk tidak tersedia'
  }));

  // Transform database categories
  const categories = ["All", ...dbCategories.map(c => c.name)];

  // Check authentication when user tries to add to cart or confirm order
  const checkAuthAndProceed = (action: () => void) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    action();
  };

  // Redirect to login page
  const handleRedirectToLogin = () => {
    setShowLoginModal(false);
    router.push('/login?redirect=/catalogue');
  };

  const filteredProducts = products
    .filter((product) => selectedCategory === "All" || product.category === selectedCategory)
    .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));

  // Panel dibuka begitu produk pertama ditambahkan, dan tetap terbuka
  // selama masih ada isi keranjang supaya user bisa terus menambah
  // getuk lain dengan jenis & jumlah berbeda tanpa panel menutup katalog.
  const openPanel = () => {
    if (!isPanelMounted) setIsPanelMounted(true);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    // beri jeda sesuai durasi animasi sebelum unmount, biar transisi keluar halus
    window.setTimeout(() => setIsPanelMounted(false), 300);
  };

  const handleAddProduct = (product: Product) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setCartLines((prev) => {
      const existing = prev.find((line) => line.productId === product.id);
      if (existing) {
        return prev.map((line) =>
          line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [
        ...prev,
        {
          key: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
        },
      ];
    });
    openPanel();
  };

  const updateQuantity = (key: string, delta: number) => {
    setCartLines((prev) =>
      prev
        .map((line) => (line.key === key ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line))
        .filter((line) => line.quantity > 0)
    );
  };

  const removeLine = (key: string) => {
    setCartLines((prev) => prev.filter((line) => line.key !== key));
  };

  const totalItems = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalProducts = cartLines.length;
  const totalPrice = cartLines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  const handleConfirmOrder = () => {
    if (!addItem || cartLines.length === 0) return;

    cartLines.forEach((line) => {
      addItem({
        id: line.key,
        productId: line.productId,
        quantity: line.quantity,
        price: line.price,
        name: line.name,
        image: line.image,
        pickupLocation,
      });
    });

    setCartLines([]);
    closePanel();
    router.push("/cart");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Palet gradasi oranye untuk kartu produk di dalam panel — mengikuti
  // referensi desain (setiap baris kartu gradient tanpa foto produk).
  const cardGradients = [
    "from-amber-200 via-amber-400 to-orange-600",
    "from-orange-300 via-orange-500 to-amber-700",
    "from-amber-300 via-orange-500 to-orange-700",
    "from-yellow-200 via-amber-400 to-orange-500",
  ];

  return (
    <div className="font-['Playfair_Display'] min-h-screen bg-neutral-50 selection:bg-amber-200 selection:text-amber-900">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Atas: Judul & Form Pencarian */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-neutral-200 pb-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Katalog Produk</p>
            <h1 className="text-4xl font-black tracking-tight text-amber-950">Getuk Gondok</h1>
            <p className="max-w-xl text-base leading-relaxed text-neutral-600">
              Cari dan temukan hidangan tumpeng hias, jajanan pasar tradisional, serta opsi packaging terbaik untuk momen spesial Anda.
            </p>
          </div>

          {/* Input Pencarian */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari produk di katalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 rounded-full border border-neutral-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm shadow-sm bg-white"
            />
          </div>
        </div>

        {/* Filter Kategori */}
        <div className="mt-8 flex overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-amber-700 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300 hover:bg-amber-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/*
          Wrapper dua kolom: katalog di kiri, panel ringkasan pesanan di kanan.
          Saat panel terbuka, grid katalog otomatis menyempit (lg:col-span-8)
          alih-alih tertutup overlay, sesuai desain — panel tidak menutupi
          produk melainkan mendorong layout jadi 2 kolom berdampingan.
        */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className={isPanelMounted ? "lg:col-span-8" : "lg:col-span-12"}>
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                    <div className="w-full aspect-square bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-10 bg-gray-200 rounded w-full" />
                      <div className="flex justify-between items-center mt-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                        <div className="h-10 w-10 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent"
                  >
                    <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-lg font-black text-amber-700">{formatPrice(product.price)}</span>
                        <button
                          onClick={() => handleAddProduct(product)}
                          className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
                          aria-label={`Tambah ${product.name}`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Kondisi Jika Produk Kosong */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-amber-200 mt-10">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Produk tidak ditemukan</h3>
                <p className="text-gray-500 mt-2">Coba gunakan kata kunci atau kategori filter lain.</p>
              </div>
            )}

            {/* Tombol Navigasi Kembali */}
            <div className="mt-12 flex justify-center">
              <Link href="/" className="inline-flex rounded-full bg-amber-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-900 shadow-md">
                ← Kembali ke Landing Page
              </Link>
            </div>
          </div>

          {/* Panel Ringkasan Pesanan — kolom kanan, sejajar dengan katalog, bukan overlay fullscreen */}
          {isPanelMounted && (
            <div className="lg:col-span-4">
              <div
                className={`sticky top-6 rounded-3xl border border-amber-100 bg-amber-50/60 p-5 shadow-lg transition-all duration-300 ease-out ${
                  isPanelOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Ringkasan Pesanan</p>
                    <h2 className="mt-1 text-xl font-black text-amber-950">Keranjang Anda</h2>
                  </div>
                  <button
                    onClick={closePanel}
                    className="rounded-full p-2 text-gray-500 transition hover:bg-white hover:text-gray-700"
                    aria-label="Tutup panel"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Daftar item, tiap baris kartu gradient sesuai referensi desain */}
                <div className="mt-5 space-y-3 max-h-[360px] overflow-y-auto pr-1 hide-scrollbar">
                  {cartLines.length === 0 && (
                    <p className="rounded-2xl bg-white/70 p-4 text-sm text-gray-500 text-center">
                      Belum ada produk. Klik tombol + pada katalog untuk menambahkan.
                    </p>
                  )}
                  {cartLines.map((line, index) => (
                    <div
                      key={line.key}
                      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-white shadow-sm ${
                        cardGradients[index % cardGradients.length]
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">{line.name}</p>
                          <p className="text-xs text-white/80">{formatPrice(line.price)} / pcs</p>
                        </div>
                        <button
                          onClick={() => removeLine(line.key)}
                          className="shrink-0 rounded-full bg-black/15 p-1.5 transition hover:bg-black/30"
                          aria-label={`Hapus ${line.name}`}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm">
                          <button
                            onClick={() => updateQuantity(line.key, -1)}
                            className="flex h-5 w-5 items-center justify-center text-sm font-bold"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">{line.quantity}</span>
                          <button
                            onClick={() => updateQuantity(line.key, 1)}
                            className="flex h-5 w-5 items-center justify-center text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-black">{formatPrice(line.price * line.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lokasi Pengambilan */}
                <div className="mt-5 border-t border-amber-200/60 pt-4">
                  <p className="text-sm font-semibold text-gray-800">Lokasi Pengambilan</p>
                  <div className="mt-3 space-y-2">
                    {PICKUP_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setPickupLocation(option.id)}
                        className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                          pickupLocation === option.id
                            ? "border-amber-500 bg-white"
                            : "border-transparent bg-white/50 hover:bg-white"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                            pickupLocation === option.id ? "border-amber-600" : "border-gray-300"
                          }`}
                        >
                          {pickupLocation === option.id && <span className="h-2 w-2 rounded-full bg-amber-600" />}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-gray-900">{option.label}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">{option.address}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="mt-5 space-y-2 border-t border-amber-200/60 pt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Total Produk</span>
                    <span className="font-semibold text-gray-900">{totalProducts} Produk</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      Total Harga
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px] text-gray-400"
                        title={`${totalItems} item dari ${totalProducts} produk`}
                      >
                        ?
                      </span>
                    </span>
                    <span className="text-lg font-black text-amber-700">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  disabled={cartLines.length === 0}
                  className="mt-5 w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Pesan Sekarang!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Login Diperlukan</h3>
              <p className="text-gray-600 mb-6">Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang.</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRedirectToLogin}
                  className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition"
                >
                  Login Sekarang
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles Overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
