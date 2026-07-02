"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Order, OrderItem, Product } from "@prisma/client";
import { previewInvoicePDF, generateInvoicePDF } from "@/lib/generateInvoicePDF";

interface InvoicePreviewProps {
  order: Order & {
    items: (OrderItem & {
      product: Product;
    })[];
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

interface OrderForPDF {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingCost: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
  notes?: string;
}

export default function InvoicePreview({ order }: InvoicePreviewProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Memoize orderForPDF to prevent infinite loop
  const orderForPDF = useMemo<OrderForPDF>(() => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    shippingCost: Number(order.shippingCost),
    createdAt: order.createdAt.toString(),
    user: {
      name: order.user.name,
      email: order.user.email,
    },
    items: order.items.map((item) => ({
      id: item.id,
      quantity: Number(item.quantity),
      price: Number(item.price),
      product: {
        name: item.product.name,
      },
    })),
    notes: order.notes || undefined,
  }), [order]);

  // Memoize PDF URL generation
  const generatedPdfUrl = useMemo(() => {
    return previewInvoicePDF(orderForPDF);
  }, [orderForPDF]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsLoading(false);
      // Use memoized URL
      const url = generatedPdfUrl;
      setPdfUrl(url);
    }
  }, [isLoggedIn, router, orderForPDF]);

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.print();
    }
  };

  const handleSave = () => {
    generateInvoicePDF(orderForPDF);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Preview Struk</h1>
              <p className="text-gray-600">Order #{order.orderNumber}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Simpan PDF
              </button>
            </div>
          </div>
        </div>

        {/* PDF Preview Container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Tampilkan pratinjau struk di bawah ini
            </p>
          </div>
          
          {/* PDF Preview */}
          <div className="relative bg-gray-200 p-4 min-h-[600px] flex justify-center">
            {pdfUrl ? (
              <iframe
                ref={iframeRef}
                src={pdfUrl}
                className="w-full max-w-[210mm] h-[600px] bg-white shadow-lg"
                title="Invoice Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat pratinjau...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Detail Pesanan</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-semibold text-gray-800">{order.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Amount</p>
              <p className="font-semibold text-gray-800">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(Number(order.totalAmount))}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Tanggal</p>
              <p className="font-semibold text-gray-800">
                {new Date(order.createdAt).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Pelanggan</p>
              <p className="font-semibold text-gray-800">{order.user.name}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">Item Pesanan</h3>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">Produk</th>
                  <th className="border border-gray-300 p-2 text-center">Jumlah</th>
                  <th className="border border-gray-300 p-2 text-right">Harga</th>
                  <th className="border border-gray-300 p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-2">{item.product.name}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 p-2 text-right">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(item.price))}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(item.quantity) * Number(item.price))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {order.notes && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800">Catatan:</p>
              <p className="text-sm text-yellow-700">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
