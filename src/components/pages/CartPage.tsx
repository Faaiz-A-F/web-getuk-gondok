import React from 'react';

export function CartPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Utama */}
        <div className="border-b border-slate-200 pb-5 mb-8">
          <h1 className="text-3xl font-serif tracking-wide text-[#d58040]font-bold">
            GETUK GONDOK CART
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri - Daftar Produk & Rekomendasi */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Cart Container */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 bg-slate-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {/* Cart Item */}
              <div className="grid grid-cols-1 md:grid-cols-12 p-6 border-b border-slate-100 items-center gap-4 hover:bg-slate-50/50 transition duration-200">
                {/* Info Produk */}
                <div className="md:col-span-6 flex gap-4 items-center">
                  <div className="w-20 h-24 bg-slate-100 border border-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-slate-400 font-medium">
                    [Image]
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0b2438] text-base hover:text-[#e87c1e] cursor-pointer transition">
                      ""
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      <span className="font-medium text-slate-400">Weight:</span> 250 g
                    </p>
                  </div>
                </div>

                {/* Kontrol Kuantitas */}
                <div className="md:col-span-3 flex justify-start md:justify-center items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white p-1 shadow-sm">
                    <button className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded transition font-medium">-</button>
                    <span className="w-8 text-center text-sm font-semibold text-slate-800">1</span>
                    <button className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded transition font-medium">+</button>
                  </div>
                  
                  {/* Tombol Refresh */}
                  <button className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition" title="Update quantity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
                    </svg>
                  </button>
                </div>

                {/* Total Harga Item */}
                <div className="md:col-span-3 text-left md:text-right flex md:flex-col justify-between md:justify-center items-center md:items-end">
                  <div>
                    <p className="text-slate-400 text-[11px] mb-0.5">"" <span className="text-[10px]">(incl. 0.19€ VAT)</span></p>
                    <p className="font-bold text-[#0b2438] text-base">""</p>
                  </div>
                  
                  {/* Tombol Hapus */}
                  <button className="text-xs text-rose-500 mt-1 hover:text-rose-700 font-medium flex items-center gap-1 p-1 rounded hover:bg-rose-50 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>

              {/* Subtotal Section */}
              <div className="flex justify-end bg-slate-50/50 px-6 py-4 border-b border-slate-100 text-sm">
                <p className="text-slate-600 font-medium">
                  Subtotal (1 item): <span className="font-bold text-[#0b2438] text-base ml-2">""</span>
                </p>
              </div>

              {/* Coupon Section */}
              <div className="flex flex-col sm:flex-row justify-end p-6 gap-3 bg-white">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="border border-slate-200 rounded-lg px-4 py-2 w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2438]/20 focus:border-[#0b2438] transition bg-slate-50/50"
                />
                <button className="bg-[#0b2438] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 shadow-sm transition duration-200 whitespace-nowrap">
                  Apply Coupon
                </button>
              </div>
            </div>

            {/* Suggestions (You might also like) */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#0b2438] text-lg mb-1">You might also like</h3>
              <p className="text-xs text-slate-400 mb-6">Recommended items based on your cart</p>
              
              <div className="space-y-4">
                {/* Suggestion Item 1 */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-200 hover:border-slate-300 transition">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-16 bg-slate-100 rounded-md flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-[#0b2438] text-sm uppercase tracking-wide">""</h4>
                      <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider mb-0.5">""</p>
                      <p className="font-bold text-slate-700 text-sm">""</p>
                    </div>
                  </div>
                  <button className="bg-[#e87c1e] text-white px-4 py-2 rounded-full flex items-center gap-1.5 text-xs font-bold hover:bg-orange-600 transition shadow-sm shadow-orange-500/10">
                    <span>+</span> Add to Cart
                  </button>
                </div>

                {/* Suggestion Item 2 */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-200 hover:border-slate-300 transition">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-16 bg-slate-100 rounded-md flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-[#0b2438] text-sm uppercase tracking-wide">Coconut Blossom Sugar</h4>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-0.5">Premium Organic</p>
                      <p className="font-bold text-slate-700 text-sm flex gap-2 items-center">
                        <span className="line-through text-slate-400 font-normal text-xs">""</span> 
                        <span className="text-rose-600">""</span>
                      </p>
                    </div>
                  </div>
                  <button className="bg-[#e87c1e] text-white px-4 py-2 rounded-full flex items-center gap-1.5 text-xs font-bold hover:bg-orange-600 transition shadow-sm shadow-orange-500/10">
                    <span>+</span> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Membership Card (Premium Dark Style) */}
            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white rounded-xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-semibold text-slate-300 text-xs uppercase tracking-wider">Membership</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Your tier status benefits</p>
                </div>
                <div className="bg-amber-500/10 text-amber-400 font-bold text-xs px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1 tracking-wide">
                  <span>👑</span> GOLD
                </div>
              </div>
              
              <div className="flex justify-between items-baseline mb-6 border-t border-slate-800 pt-4">
                <span className="text-xs text-slate-400 font-medium">Store Credit Balance</span>
                <span className="text-xl font-bold text-white">""</span>
              </div>
              
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2 rounded-lg flex justify-center items-center gap-2 text-xs font-semibold transition">
                Top Up Balance
              </button>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm text-sm">
              <h3 className="font-bold text-[#0b2438] text-base mb-4 border-b border-slate-100 pb-3">Order Summary</h3>
              
              <div className="space-y-3 border-b border-slate-100 pb-4 mb-4 text-slate-600">
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Subtotal <span className="text-[10px] block text-slate-400">(excl. VAT)</span></span> 
                  <span className="font-medium text-slate-800">""</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated VAT</span> 
                  <span className="font-medium text-slate-800">""</span>
                </div>
                <div className="flex justify-between font-semibold text-[#0b2438] pt-1">
                  <span>Subtotal <span className="text-[10px] font-normal block text-slate-400">(incl. VAT)</span></span> 
                  <span className="text-base">""</span>
                </div>
              </div>

              {/* Store Credit Applied */}
              <div className="flex justify-between border-b border-slate-100 pb-4 mb-4 text-amber-700 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/50">
                <span className="flex items-center gap-1.5 font-semibold text-xs">👑 Applied Credit</span>
                <div className="text-right">
                  <div className="font-bold text-xs">""</div>
                  <button className="text-[10px] text-slate-400 hover:text-rose-600 transition underline mt-0.5">
                    Remove
                  </button>
                </div>
              </div>

              {/* Shipping Options */}
              <div className="border-b border-slate-100 pb-4 mb-4 text-slate-600">
                <p className="font-bold text-[#0b2438] mb-3 text-xs uppercase tracking-wider">Shipping Method</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition text-xs">
                    <input type="radio" name="shipping" className="accent-[#0b2438] h-3.5 w-3.5" /> 
                    <span className="flex-1 font-medium">Free Shipping</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition text-xs bg-slate-50/50">
                    <input type="radio" name="shipping" defaultChecked className="accent-[#0b2438] h-3.5 w-3.5" /> 
                    <span className="flex-1 font-medium">Flat Rate: <span className="font-bold">5.00 €</span></span>
                  </label>
                  <label className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition text-xs">
                    <input type="radio" name="shipping" className="accent-[#0b2438] h-3.5 w-3.5" /> 
                    <span className="flex-1 font-medium">Local Pickup</span>
                  </label>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline font-black text-xl text-[#0b2438] mb-5">
                <span>Total Due</span>
                <span className="text-2xl text-[#e87c1e]">""</span>
              </div>

              {/* Delivery Note */}
              <div className="text-[11px] text-slate-500 mb-6 bg-slate-50 p-3 border border-slate-100 rounded-lg leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 text-[#0b2438] mb-1">
                  <span>🚚</span> Shipping Restrictions:
                </p>
                <p>Delivery of our boutique items is exclusively restricted to Germany and Austria.</p>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-[#e87c1e] text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 text-sm hover:bg-orange-600 transition shadow-md shadow-orange-500/20 group">
                Proceed to Checkout 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Payment Methods */}
            <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm text-center">
              <p className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider mb-3">Accepted Payments</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['AMEX', 'MC', 'PayPal', 'SOFORT', 'VISA'].map((gate) => (
                  <div key={gate} className="h-6 w-11 border border-slate-200 rounded bg-slate-50 flex items-center justify-center text-[8px] font-bold text-slate-400 tracking-tighter shadow-2xs">
                    {gate}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}