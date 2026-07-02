"use client"; // ← WAJIB di baris paling pertama, sebelum import apa pun!

import React, { useState, useContext } from 'react';
import Image from "next/image";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";

// ... sisa kode / INITIAL_ITEMS ke bawah tetap sama

// Duplikasi data produk untuk pencarian relasi detail produk (id, nama, gambar)
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

export default function Checkout() {
  // Mengasumsikan CartContext menyediakan array 'cart', fungsi 'updateQuantity', dan 'removeItem'
  // GANTI BARIS INI:
// const { cart = [], updateQuantity, removeItem } = useContext(CartContext) || {};

// MENJADI SEPERTI INI:
const context = useContext(CartContext) as any;
const cart = context?.cart || [];
const updateQuantity = context?.updateQuantity;
const removeItem = context?.removeItem;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    deliveryMethod: "pickup", // pickup | delivery
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Kalkulasi Total Belanjaan
  const totalSummary = cart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

  // Integrasi Generator Link WhatsApp otomatis
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) return alert("Keranjang belanja Anda masih kosong.");

    // Bangun string teks pesanan rapi untuk WhatsApp
    let itemText = "";
    cart.forEach((item: any) => {
      const matchProduct = products.find((p) => p.id === item.productId);
      if (matchProduct) {
        itemText += `- *${matchProduct.name}* (${item.quantity}x) : ${formatPrice(item.price * item.quantity)}\n`;
      }
    });

    const textMessage = `*NOTA PESANAN GETUK GONDOK HJ. SRI RAHAYU*\n\n` +
      `*Detail Pemesan:*\n` +
      `Nama: ${formData.name}\n` +
      `No. WhatsApp: ${formData.phone}\n\n` +
      `*Metode Pengambilan:*\n` +
      `${formData.deliveryMethod === "pickup" ? "Ambil Sendiri di Toko" : "Kirim / Delivery"}\n` +
      `${formData.deliveryMethod === "delivery" ? `Alamat Kirim: ${formData.address}\n` : ""}\n` +
      `*Waktu Acara / Pengambilan:*\n` +
      `Tanggal: ${formData.deliveryDate}\n` +
      `Jam: ${formData.deliveryTime} WIB\n\n` +
      `*Daftar Pesanan:*\n${itemText}\n` +
      `*Total Tagihan:* *${formatPrice(totalSummary)}*\n\n` +
      `*Catatan Tambahan:*\n${formData.notes || "-"}\n\n` +
      `Mohon segera dikonfirmasi dan dikirimkan detail rekening pembayarannya ya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(textMessage);
    // Nomor admin disesuaikan dari footer halaman utama kamu (0856 4373 0540)
    const whatsappUrl = `https://wa.me/6285643730540?text=${encodedMessage}`;

    // Redirect ke WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-amber-950">
      {/* Sederhana Minimalis Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-amber-100 p-1.5 rounded-lg">
              <Image src="/logo/1_20260505_231853_0000(1).png" alt="Logo" width={35} height={35} className="object-contain" />
            </div>
            <span className="text-xl font-black tracking-tight text-amber-950">Getuk Gondok</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition">
            ← Kembali ke Katalog
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <h2 className="text-3xl font-black tracking-tight mb-8">Formulir Checkout Pesanan</h2>

        {cart.length === 0 ? (
          /* State saat keranjang kosong */
          <div className="text-center bg-white border border-amber-100 rounded-3xl p-12 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Keranjang Anda Kosong</h3>
            <p className="text-gray-500 text-sm mb-6">Silakan pilih kudapan tradisional atau tumpeng spesial kami terlebih dahulu.</p>
            <Link href="/" className="inline-block px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-full font-semibold transition shadow-md">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          /* Grid Utama Layout */
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* SISI KIRI: Formulir Pengiriman & Waktu Acara */}
            <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold border-b border-amber-50 pb-3 mb-4">1. Informasi Pemesan</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Contoh: 0856xxxxxxxx"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold border-b border-amber-50 pb-3 mb-4">2. Metode & Waktu Pengantaran</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tanggal Diperlukan</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      required
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Jam Pengambilan/Kirim</label>
                    <input
                      type="time"
                      name="deliveryTime"
                      required
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Pilihan Opsi Distribusi</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition ${formData.deliveryMethod === "pickup" ? "border-amber-600 bg-amber-50/40" : "border-gray-200 hover:bg-neutral-50"}`}>
                      <input type="radio" name="deliveryMethod" value="pickup" checked={formData.deliveryMethod === "pickup"} onChange={handleInputChange} className="accent-amber-700 h-4 w-4" />
                      <div>
                        <p className="text-sm font-bold">Ambil Sendiri</p>
                        <p className="text-xs text-gray-500">Ke outlet Magelang</p>
                      </div>
                    </label>
                    <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition ${formData.deliveryMethod === "delivery" ? "border-amber-600 bg-amber-50/40" : "border-gray-200 hover:bg-neutral-50"}`}>
                      <input type="radio" name="deliveryMethod" value="delivery" checked={formData.deliveryMethod === "delivery"} onChange={handleInputChange} className="accent-amber-700 h-4 w-4" />
                      <div>
                        <p className="text-sm font-bold">Kirim Kurir</p>
                        <p className="text-xs text-gray-500">Tarif menyesuaikan jarak</p>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.deliveryMethod === "delivery" && (
                  <div className="mt-4 animate-[fadeIn_0.2s_ease-out]">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Alamat Pengiriman Lengkap</label>
                    <textarea
                      name="address"
                      required={formData.deliveryMethod === "delivery"}
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, dan patokan lokasi..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none transition resize-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold border-b border-amber-50 pb-3 mb-4">3. Catatan Khusus Kue</h3>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Contoh: Tulisan ucapan di tumpeng 'Selamat Ulang Tahun Ibu', atau tingkat kepedasan sambal..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-base"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.714-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.528 1.975 14.069.951 11.524.951c-5.438 0-9.862 4.37-9.866 9.801-.001 1.744.47 3.447 1.361 4.947l-.995 3.637 3.733-.969z" />
                </svg>
                Kirim & Pesan via WhatsApp
              </button>
            </form>

            {/* SISI KANAN: Ringkasan Keranjang Belanja */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                  <span>Ringkasan Order</span>
                  <span className="text-sm font-medium text-gray-500">({cart.length} Jenis)</span>
                </h3>

                {/* List Item */}
                <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto pr-1">
                  {cart.map((item: any) => {
                    const matchedProduct = products.find((p) => p.id === item.productId);
                    if (!matchedProduct) return null;

                    return (
                      <div key={item.id} className="py-4 flex gap-4 items-center">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-gray-100 flex-shrink-0">
                          <Image src={matchedProduct.image || "/nobg/1.png"} alt={matchedProduct.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 truncate">{matchedProduct.name}</h4>
                          <p className="text-xs text-amber-700 font-bold mt-0.5">{formatPrice(item.price)}</p>
                          
                          {/* Kontrol Kuantitas Kecil */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity && updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 rounded bg-neutral-100 hover:bg-amber-100 text-neutral-600 hover:text-amber-900 text-xs font-bold transition flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity && updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-neutral-100 hover:bg-amber-100 text-neutral-600 hover:text-amber-900 text-xs font-bold transition flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Tombol Hapus & Subtotal */}
                        <div className="text-right flex flex-col items-end gap-2">
                          <span className="text-sm font-black text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                          <button
                            type="button"
                            onClick={() => removeItem && removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition"
                            title="Hapus item"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Perhitungan Akhir */}
                <div className="border-t border-gray-100 pt-4 mt-2 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal Produk</span>
                    <span className="font-semibold text-gray-900">{formatPrice(totalSummary)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Biaya Pengiriman</span>
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md self-center">
                      {formData.deliveryMethod === "pickup" ? "Gratis (Ambil Sendiri)" : "Dihitung Admin"}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-950">Total Pembayaran</span>
                    <span className="text-xl font-black text-amber-700">{formatPrice(totalSummary)}</span>
                  </div>
                </div>
              </div>

              {/* Box Informasi Penting Pemesanan Kuliner */}
              <div className="bg-amber-950 text-amber-100/80 rounded-3xl p-5 text-xs leading-relaxed space-y-2.5 shadow-md">
                <p className="font-bold text-white text-sm mb-1">📢 Syarat & Ketentuan Pemesanan:</p>
                <p>• Pesanan tumpeng dan tampah set sebaiknya dilakukan H-2 atau selambat-lambatnya H-1 sebelum jam acara.</p>
                <p>• Setelah menekan tombol kirim, Anda akan diarahkan ke WhatsApp untuk validasi ketersediaan slot kurir atau konfirmasi pengambilan.</p>
                <p>• Pembayaran dianggap sah jika sudah melakukan transfer DP/Lunas ke rekening resmi toko setelah dikonfirmasi oleh Admin WhatsApp kami.</p>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}