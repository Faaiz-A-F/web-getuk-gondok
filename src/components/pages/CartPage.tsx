"use client";

import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const ADMIN_FEE = 2000;

export function CartPage() {
  const { items, removeItem, updateQuantity, updateNote, clearCart } = useContext(CartContext) || { items: [], removeItem: () => {}, updateQuantity: () => {}, updateNote: () => {}, clearCart: () => {} };
  const { user, isLoggedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check authentication on mount
  useEffect(() => {
    if (isLoaded && !isLoggedIn) {
      setShowLoginModal(true);
    }
  }, [isLoaded, isLoggedIn]);

  // Redirect to login page
  const handleRedirectToLogin = () => {
    setShowLoginModal(false);
    router.push('/login?redirect=/cart');
  };

  // Handle checkout - create order and redirect
  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      
      // Prepare order data - combine all item notes into a single order note
      const combinedNotes = items
        .filter(item => item.note && item.note.trim())
        .map(item => `${item.name}: ${item.note}`)
        .join('; ');
      
      const orderData = {
        orderNumber,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          note: item.note || null,
        })),
        subtotal,
        adminFee: ADMIN_FEE,
        totalAmount: totalAdmin,
        pickupLocation: items[0]?.pickupLocation || 'rumah-produksi',
        userId: user?.id,
        notes: combinedNotes || null,
      };
      
      // Call API to create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      
      if (response.ok) {
        // Clear cart after successful order
        clearCart();
        // Show success notification
        setShowSuccessModal(true);
      } else {
        // Show error notification
        const data = await response.json();
        setErrorMessage(data.error || 'Gagal membuat pesanan. Silakan coba lagi.');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // Show error notification
      setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
      setShowErrorModal(true);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Handle redirect to landing page after success
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push('/');
  };

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Calculate total (admin) = subtotal + admin fee
  const totalAdmin = subtotal + ADMIN_FEE;

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleIncrement = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty + 1);
  };

  const handleDecrement = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      
      {/* Main Content Area - Side-by-Side Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Panel Kiri - Shopping Cart Card */}
          <div className="lg:col-span-7 space-y-6">
            {/* Cart Container with Krem Background */}
            <div className="bg-[#F7F0E8] rounded-3xl shadow-lg p-6 lg:p-8">
              
              {/* Header - Back Button + Title */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Link href="/catalogue" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-amber-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                  <span className="font-bold text-amber-900 text-sm tracking-wide">Shopping Continue</span>
                </div>
                <div className="border-b border-amber-300/50 mb-6"></div>
                
                {/* Section Title */}
                <h2 className="text-3xl font-black text-amber-950 tracking-tight">
                  Shopping cart
                </h2>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                
                {/* Empty Cart State */}
                {items.length === 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Keranjang kosong</h3>
                    <p className="text-gray-500 mb-4">Pilih produk dari katalog untuk menambahkan ke keranjang.</p>
                    <Link href="/catalogue" className="inline-flex rounded-full bg-amber-600 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition">
                      Lihat Katalog
                    </Link>
                  </div>
                )}

                {/* Cart Items */}
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name || 'Product'} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-2xl">🍚</span>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-amber-950 text-base">{item.name || 'Product'}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{formatPrice(item.price)} / pcs</p>
                      </div>
                      
                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDecrement(item.id, item.quantity)}
                          className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-semibold text-amber-950 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleIncrement(item.id, item.quantity)}
                          className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Price */}
                      <div className="font-bold text-amber-950 text-base w-28 text-right">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Note Input */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Tambahkan catatan khusus untuk item ini..."
                          value={item.note || ''}
                          onChange={(e) => updateNote(item.id, e.target.value)}
                          className="flex-1 text-sm text-gray-600 placeholder-gray-400 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                          maxLength={500}
                        />
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* Panel Kanan - QRIS Payment Card */}
          <div className="lg:col-span-5">
            {/* Payment Card with Gradient Background */}
            <div className="bg-gradient-to-b from-orange-600 to-orange-400 rounded-3xl shadow-xl p-6 lg:p-8 relative">
              
              {/* Header with Profile Avatar */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-white font-black text-2xl lg:text-3xl leading-tight">
                  QRIS<br/>PAYMENT
                </h2>
                <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
                  <span className="text-lg">👤</span>
                </div>
              </div>

              {/* QR Code Area - White Box */}
              <div className="bg-white rounded-2xl p-6 mb-6 flex items-center justify-center">
                <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-gray-400 text-xs text-center px-4">QR Code Placeholder</span>
                </div>
              </div>

              {/* Floating White Card */}
              <div className="bg-white rounded-2xl p-5 shadow-lg">
                
                {/* Subtotal Row */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-amber-800 font-medium">Subtotal</span>
                  <span className="font-bold text-amber-950">{formatPrice(subtotal)}</span>
                </div>
                
                {/* Total Admin Row */}
                <div className="flex justify-between items-center mb-5">
                  <span className="text-gray-500 text-sm">Total (admin)</span>
                  <span className="font-semibold text-gray-600 text-sm">{formatPrice(totalAdmin)}</span>
                </div>
                
                {/* Divider */}
                <div className="border-t border-gray-200 mb-5" />
                
                {/* Checkout Button */}
                <button 
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isCheckingOut}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-orange-600 transition shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Checkout
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>

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
              <p className="text-gray-600 mb-6">Anda harus login terlebih dahulu untuk mengakses halaman keranjang dan melanjutkan pembayaran.</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRedirectToLogin}
                  className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition"
                >
                  Login Sekarang
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!isLoaded && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
        </div>
      )}

      {/* Success Notification Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h3>
              <p className="text-gray-600 mb-6">Pesanan Anda telah masuk ke database dan sedang menunggu konfirmasi pembayaran.</p>
              <button
                onClick={handleSuccessClose}
                className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pesanan Gagal!</h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
