'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { CartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils/formatPrice';

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  weight: number;
  category: string;
  image: string;
}

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const cart = useContext(CartContext);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const addToCart = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`);
      return;
    }
    cart?.addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      pickupLocation: 'rumah-produksi',
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="min-h-[70vh] bg-[#f8f6f2]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <Link href="/catalogue" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-amber-800">
          <ArrowLeft className="h-4 w-4" /> Kembali ke katalog
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(74,45,23,0.09)]">
            <Image src={product.image} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            <span className="absolute left-5 top-5 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-sm backdrop-blur">{product.category}</span>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Produk pilihan</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-3xl font-extrabold tracking-tight text-amber-800">{formatPrice(product.price)}</p>
            <p className="mt-6 text-base leading-8 text-stone-600">{product.description}</p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <Truck className="h-5 w-5 text-amber-700" />
                <p className="mt-2 text-xs font-bold text-stone-800">Berat produk</p>
                <p className="mt-0.5 text-xs text-stone-500">{product.weight} gram</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                <p className="mt-2 text-xs font-bold text-stone-800">Dibuat segar</p>
                <p className="mt-0.5 text-xs text-stone-500">Resep keluarga pilihan</p>
              </div>
            </div>

            <div className="mt-8 border-t border-stone-200 pt-7">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-bold text-stone-700">Jumlah pesanan</label>
                <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>{product.stock > 0 ? `${product.stock} tersedia` : 'Stok habis'}</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-13 items-center justify-between rounded-xl border border-stone-200 bg-white px-2 sm:w-36">
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Kurangi jumlah" className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-800"><Minus className="h-4 w-4" /></button>
                  <span className="font-bold text-stone-900">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} aria-label="Tambah jumlah" className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-800"><Plus className="h-4 w-4" /></button>
                </div>
                <button type="button" onClick={addToCart} disabled={product.stock < 1} className={`inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${added ? 'bg-emerald-700' : 'bg-amber-800 hover:bg-amber-900'}`}>
                  {added ? <><Check className="h-5 w-5" /> Ditambahkan</> : <><ShoppingBag className="h-5 w-5" /> Tambah ke keranjang</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
