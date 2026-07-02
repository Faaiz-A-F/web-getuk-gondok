"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Order, OrderItem, Product } from "@prisma/client";
import { jsPDF } from "jspdf";

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

// Store information
const STORE_INFO = {
  name: "Getuk Gondok Hj. Sri Rahayu",
  address: "Jl. Mataram No.9A, RejowinagunSel, Kec. MagelangSel, Kota Magelang",
  phone: "085643730540",
  website: "getukgondok.my.id",
  logoPath: "/logo/13.png",
};

const ADMIN_FEE = 2000;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`;
};

const generatePDFBlob = (order: OrderForPDF): Blob => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let yPos = margin;

  const addCenteredText = (
    text: string,
    y: number,
    fontSize: number,
    fontStyle: "normal" | "bold" = "normal"
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fontStyle: "normal" | "bold" = "normal"
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.text(text, x, y);
  };

  const addLine = (startY: number) => {
    doc.setLineWidth(0.3);
    doc.line(margin, startY, pageWidth - margin, startY);
  };

  const addDashedLine = (startY: number) => {
    doc.setLineWidth(0.2);
    doc.setDrawColor(150, 150, 150);
    const dashLength = 3;
    const gapLength = 2;
    let x = margin;
    while (x < pageWidth - margin) {
      doc.line(x, startY, Math.min(x + dashLength, pageWidth - margin), startY);
      x += dashLength + gapLength;
    }
    doc.setDrawColor(0, 0, 0);
  };

  // Add logo at top center
  try {
    const logoSize = 25;
    const logoX = (pageWidth - logoSize) / 2;
    doc.addImage(STORE_INFO.logoPath, "PNG", logoX, yPos, logoSize, logoSize);
    yPos += logoSize + 3;
  } catch (error) {
    console.error("Error adding logo:", error);
    yPos += 5;
  }

  addCenteredText(STORE_INFO.address, yPos, 7, "normal");
  yPos += 4;
  addCenteredText(`${STORE_INFO.phone} | ${STORE_INFO.website}`, yPos, 7, "normal");
  yPos += 6;

  addDashedLine(yPos);
  yPos += 5;

  addText("Order ID:", margin, yPos, 8, "bold");
  addText(`#${order.orderNumber}`, margin + 30, yPos, 8, "normal");
  yPos += 4;

  addText("Tanggal:", margin, yPos, 8, "bold");
  addText(formatDate(order.createdAt), margin + 30, yPos, 8, "normal");
  yPos += 4;

  addText("Pelanggan:", margin, yPos, 8, "bold");
  addText(order.user.name, margin + 30, yPos, 8, "normal");
  yPos += 6;

  addDashedLine(yPos);
  yPos += 5;

  addText("Nama", margin, yPos, 8, "bold");
  addText("Qty", margin + 60, yPos, 8, "bold");
  addText("Harga", margin + 75, yPos, 8, "bold");
  yPos += 4;

  addLine(yPos);
  yPos += 4;

  let subtotal = 0;
  order.items.forEach((item) => {
    const itemSubtotal = Number(item.quantity) * Number(item.price);
    subtotal += itemSubtotal;

    let itemName = item.product.name;
    if (itemName.length > 25) {
      itemName = itemName.substring(0, 22) + "...";
    }
    addText(itemName, margin, yPos, 8, "normal");
    addText(item.quantity.toString(), margin + 60, yPos, 8, "normal");
    addText(formatCurrency(itemSubtotal), margin + 75, yPos, 8, "normal");
    yPos += 4;
  });

  if (order.notes && order.notes.trim() !== "") {
    yPos += 2;
    addText("Catatan:", margin, yPos, 7, "bold");
    yPos += 3;
    addText(order.notes, margin, yPos, 7, "normal");
    yPos += 4;
  }

  yPos += 2;
  addDashedLine(yPos);
  yPos += 5;

  addText("Subtotal:", margin, yPos, 8, "normal");
  addText(formatCurrency(subtotal), margin + 75, yPos, 8, "normal");
  yPos += 4;

  addText("Biaya Admin:", margin, yPos, 8, "normal");
  addText(formatCurrency(ADMIN_FEE), margin + 75, yPos, 8, "normal");
  yPos += 5;

  addLine(yPos);
  yPos += 4;

  const total = subtotal + ADMIN_FEE;
  addText("TOTAL", margin, yPos, 10, "bold");
  addText(formatCurrency(total), margin + 75, yPos, 10, "bold");
  yPos += 6;

  addDashedLine(yPos);
  yPos += 8;

  addCenteredText("Terima Kasih Telah Berbelanja Di", yPos, 8, "normal");
  yPos += 4;
  addCenteredText(STORE_INFO.name, yPos, 8, "bold");
  yPos += 6;
  addCenteredText(`Pesan anti ribet di ${STORE_INFO.website}`, yPos, 7, "normal");
  yPos += 6;
  addCenteredText("<<<<>>>>", yPos, 10, "bold");

  return doc.output("blob");
};

export default function InvoicePreview({ order }: InvoicePreviewProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

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

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, router]);

  // Generate PDF blob URL when component mounts
  useEffect(() => {
    if (!isLoading) {
      const blob = generatePDFBlob(orderForPDF);
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      setPdfUrl(url);
    }

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, [isLoading, orderForPDF]);

  const handlePrint = useCallback(() => {
    if (pdfUrl) {
      // Open PDF in new window for printing
      const printWindow = window.open(pdfUrl, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      } else {
        alert("Mohon izinkan popup untuk mencetak");
      }
    }
  }, [pdfUrl]);

  const handleSave = useCallback(() => {
    const blob = generatePDFBlob(orderForPDF);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Struk-${orderForPDF.orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [orderForPDF]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700 font-medium">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-amber-950">Preview Struk</h1>
              <p className="text-amber-600 font-medium">Order #{order.orderNumber}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all font-semibold shadow-lg shadow-amber-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-semibold shadow-lg shadow-emerald-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Simpan PDF
              </button>
            </div>
          </div>
        </div>

        {/* PDF Preview Container - White window with scroll */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
          {/* Header bar */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 p-4">
            <p className="text-sm text-amber-700 font-medium text-center">
              Tampilkan pratinjau struk di bawah ini
            </p>
          </div>
          
          {/* PDF Preview with scrollable container */}
          <div className="p-6 bg-gradient-to-br from-slate-100 to-slate-200 min-h-[600px] overflow-auto">
            {pdfUrl ? (
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200 w-full">
                <iframe
                  src={pdfUrl}
                  className="w-full h-[600px]"
                  title="Invoice Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-amber-700 font-medium">Memuat pratinjau...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mt-6">
          <h2 className="text-lg font-bold text-amber-950 mb-4">Detail Pesanan</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
              <p className="text-amber-600 text-xs font-medium uppercase tracking-wide">Status</p>
              <p className="font-bold text-amber-950">{order.status}</p>
            </div>
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
              <p className="text-amber-600 text-xs font-medium uppercase tracking-wide">Total Amount</p>
              <p className="font-bold text-amber-950">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(Number(order.totalAmount))}
              </p>
            </div>
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
              <p className="text-amber-600 text-xs font-medium uppercase tracking-wide">Tanggal</p>
              <p className="font-bold text-amber-950">
                {new Date(order.createdAt).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
              <p className="text-amber-600 text-xs font-medium uppercase tracking-wide">Pelanggan</p>
              <p className="font-bold text-amber-950">{order.user.name}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-amber-950 mb-3">Item Pesanan</h3>
            <div className="overflow-hidden rounded-xl border border-amber-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-amber-100 to-amber-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Produk</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-amber-800">Jumlah</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-amber-800">Harga</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-amber-800">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 bg-white">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="px-4 py-3 text-slate-700">{item.product.name}</td>
                      <td className="px-4 py-3 text-center text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(item.price))}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-amber-950">
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
          </div>

          {order.notes && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm font-bold text-yellow-800">Catatan:</p>
              <p className="text-sm text-yellow-700 mt-1">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
