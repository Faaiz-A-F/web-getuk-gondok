"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import InvoicePreview from "@/components/pages/InvoicePreview";
import { Order, OrderItem, Product, User } from "@prisma/client";

interface OrderWithRelations extends Order {
  items: (OrderItem & {
    product: Product;
  })[];
  user: User;
}

export default function InvoicePreviewPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderWithRelations | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (!orderParam) {
      setError("Order ID not provided");
      setLoading(false);
      return;
    }

    try {
      // Decode the order ID from base64
      const orderId = JSON.parse(atob(orderParam));
      
      // Fetch order data from API
      fetch(`/api/orders/${orderId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Order not found");
          }
          return res.json();
        })
        .then((data) => {
          setOrder(data.order || data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch order:", err);
          setError("Failed to load order");
          setLoading(false);
        });
    } catch (err) {
      console.error("Invalid order ID:", err);
      setError("Invalid order ID");
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || "Order not found"}</p>
          <a
            href="/admin"
            className="mt-4 inline-block px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <InvoicePreview order={order} />;
}
