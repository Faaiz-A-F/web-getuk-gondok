import React from 'react';

export function CartPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Header Utama - Warenkorb */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-medium tracking-wide text-[#0b2438] mb-8">
          WARENKORB
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri - Daftar Produk */}
          <div className="lg:col-span-8">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 border-b border-gray-200 pb-2 text-sm font-semibold text-[#0b2438]">
              <div className="col-span-6">Produkt</div>
              <div className="col-span-3 text-center">Anzahl</div>
              <div className="col-span-3 text-right">Gesamtsumme</div>
            </div>

            {/* Cart Item */}
            <div className="grid grid-cols-1 md:grid-cols-12 py-6 border-b border-gray-200 items-center gap-4">
              <div className="md:col-span-6 flex gap-4">
                <div className="w-20 h-24 bg-gray-100 border border-gray-200 rounded object-cover flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                  [Gambar]
                </div>
                <div>
                  <h3 className="font-bold text-[#0b2438] text-base">Tiger</h3>
                  <p className="text-xs text-gray-500 mt-1">Gewicht:<br />250 g</p>
                </div>
              </div>
              <div className="md:col-span-3 flex justify-start md:justify-center items-center gap-3">
                <div className="border border-gray-300 rounded px-3 py-1 flex items-center gap-2 bg-white">
                  <span className="text-sm">1</span>
                  <span className="text-gray-400 text-xs">▼</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  ↻ {/* Ikon Refresh */}
                </button>
              </div>
              <div className="md:col-span-3 text-left md:text-right text-sm">
                <p className="text-gray-500 text-[11px] mb-1">1 x 9,90€ (inkl. 0,19€ MwSt.)</p>
                <p className="font-bold text-[#0b2438] text-base">10,09 €</p>
                <button className="text-[11px] text-gray-500 mt-1 hover:underline">
                  Entfernen x
                </button>
              </div>
            </div>

            {/* Subtotal Section */}
            <div className="flex justify-end py-4 border-b border-gray-200 text-sm">
              <p className="text-gray-600">
                Gesamtsumme (1 Artikel): <span className="font-bold text-[#0b2438] ml-2">20,18 €</span>
              </p>
            </div>

            {/* Coupon Section */}
            <div className="flex flex-col sm:flex-row justify-end py-6 gap-3">
              <input
                type="text"
                placeholder="Gutscheincode..."
                className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 text-sm focus:outline-none focus:border-[#0b2438]"
              />
              <button className="bg-[#0b2438] text-white px-6 py-2 rounded text-sm hover:bg-slate-800 transition">
                Gutschein anwenden
              </button>
            </div>

            {/* Suggestions (Das könnte dir auch gefallen) */}
            <div className="bg-[#f9f9f9] border border-gray-100 rounded-lg p-6 mt-4">
              <h3 className="font-bold text-[#0b2438] mb-6">Das könnte dir auch gefallen</h3>
              
              {/* Suggestion Item 1 */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-[#0b2438] text-sm uppercase">Madheling</h4>
                    <p className="text-[11px] text-teal-600 uppercase tracking-wider mb-1">100% Arabica</p>
                    <p className="font-bold text-[#0b2438] text-sm">9,90 €</p>
                  </div>
                </div>
                <button className="bg-[#e87c1e] text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-semibold hover:bg-orange-600 transition">
                  <span className="text-lg leading-none">+</span> In den Warenkorb
                </button>
              </div>

              {/* Suggestion Item 2 */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-[#0b2438] text-sm uppercase">Kokos-Blütenzucker</h4>
                    <p className="text-[11px] text-teal-600 uppercase tracking-wider mb-1">100% Kokosblütenzucker</p>
                    <p className="font-bold text-[#0b2438] text-sm flex gap-2">
                      <span className="line-through text-gray-400 font-normal">4,90 €</span> 
                      2,90 €
                    </p>
                  </div>
                </div>
                <button className="bg-[#e87c1e] text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-semibold hover:bg-orange-600 transition">
                  <span className="text-lg leading-none">+</span> In den Warenkorb
                </button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Membership Card */}
            <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-[#0b2438] text-sm">Art der Mitgliedschaft</h3>
                  <p className="text-[11px] text-gray-400 mt-1">Ihre aktive Mitgliedschaft</p>
                </div>
                <div className="text-amber-500 font-bold text-sm flex items-center gap-1">
                  <span>👑</span> GOLD
                </div>
              </div>
              <div className="flex justify-between items-center mb-5 font-bold text-[#0b2438] text-sm">
                <span>Restguthaben</span>
                <span>10€</span>
              </div>
              <button className="w-full bg-[#0b2438] text-white py-2.5 rounded-full flex justify-center items-center gap-2 text-xs font-semibold hover:bg-slate-800 transition">
                <span className="text-base leading-none">+</span> Guthaben aufladen
              </button>
            </div>

            {/* Order Summary Card */}
            <div className="bg-[#f9f9f9] border border-gray-200 rounded-lg p-5 text-sm">
              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4 text-gray-600">
                <div className="flex justify-between items-start">
                  <span>Zwischensumme <br/><span className="text-[11px] text-gray-400">(ohne MwSt.)</span></span> 
                  <span>20,18€</span>
                </div>
                <div className="flex justify-between">
                  <span>MwSt.</span> 
                  <span>0,19€</span>
                </div>
                <div className="flex justify-between font-bold text-[#0b2438] pt-1">
                  <span>Zwischensumme <br/><span className="text-[11px] text-gray-400 font-normal">(inkl. MwSt.)</span></span> 
                  <span>20,37€</span>
                </div>
              </div>

              {/* Store Credit */}
              <div className="flex justify-between border-b border-gray-200 pb-4 mb-4 text-amber-600">
                <span className="flex items-center gap-2 font-semibold">👑 Einkaufskredit</span>
                <div className="text-right">
                  <div className="font-bold">-10€</div>
                  <button className="text-[10px] text-gray-400 hover:text-gray-600 underline">
                    [Entfernen]
                  </button>
                </div>
              </div>

              {/* Shipping Form */}
              <div className="border-b border-gray-200 pb-4 mb-4 text-gray-600">
                <p className="font-bold text-[#0b2438] mb-3 text-xs">Versand</p>
                <label className="flex items-center gap-2 mb-2 cursor-pointer text-xs">
                  <input type="radio" name="shipping" className="accent-[#0b2438]" /> 
                  Kostenloser Versand
                </label>
                <label className="flex items-center gap-2 mb-2 cursor-pointer text-xs">
                  <input type="radio" name="shipping" defaultChecked className="accent-[#0b2438]" /> 
                  Flatrate: 5,00€
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input type="radio" name="shipping" className="accent-[#0b2438]" /> 
                  Lokale Aufnahme
                </label>
                <div className="text-right mt-2 text-xs">Flatrate : 5,00€</div>
              </div>

              {/* Total */}
              <div className="flex justify-between font-black text-lg text-[#0b2438] mb-5">
                <span>Gesamtsumme</span>
                <span>15,37€</span>
              </div>

              {/* Delivery Note */}
              <div className="text-[11px] text-gray-500 mb-6 bg-white p-3 border border-gray-200 rounded">
                <p className="font-bold flex items-center gap-2 text-[#0b2438] mb-1">
                  <span className="text-sm">🚚</span> Lieferhinweise:
                </p>
                <p className="leading-relaxed">Die Lieferung unserer Artikel kann nur nach Deutschland und Österreich erfolgen.</p>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-[#e87c1e] text-white py-3.5 rounded-full font-bold flex justify-center items-center gap-2 text-sm hover:bg-orange-600 transition shadow-md">
                🛒 Weiter zur Kasse
              </button>
            </div>

            {/* Payment Methods */}
            <div className="border border-gray-200 rounded-lg p-5 bg-white">
              <p className="font-bold text-[#0b2438] text-xs mb-3">Zahlungsmöglichkeiten</p>
              <div className="flex flex-wrap gap-2">
                {/* Dummy placeholders for payment icons */}
                <div className="h-6 w-10 border border-gray-200 rounded bg-gray-50 flex items-center justify-center text-[8px] text-gray-400">AMEX</div>
                <div className="h-6 w-10 border border-gray-200 rounded bg-gray-50 flex items-center justify-center text-[8px] text-gray-400">MC</div>
                <div className="h-6 w-10 border border-gray-200 rounded bg-gray-50 flex items-center justify-center text-[8px] text-gray-400">PayPal</div>
                <div className="h-6 w-10 border border-gray-200 rounded bg-gray-50 flex items-center justify-center text-[8px] text-gray-400">SOFORT</div>
                <div className="h-6 w-10 border border-gray-200 rounded bg-gray-50 flex items-center justify-center text-[8px] text-gray-400">VISA</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}