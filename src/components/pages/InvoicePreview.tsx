"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Order, OrderItem, Product } from "@prisma/client";
import { formatCurrency } from "@/utils/formatCurrency";

interface InvoicePreviewProps {
  order: Order & {
    items: (OrderItem & {
      product: Product;
    })[];
  };
}

export default function InvoicePreview({ order }: InvoicePreviewProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Invoice Preview</h2>
      <div className="mb-4">
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Amount:</strong> {formatCurrency(order.totalAmount)}</p>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Product</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item)   => (
            <tr key={item.id}>
              <td className="border border-gray-300 p-2">{item.product.name}</td>
              <td className="border border-gray-300 p-2">{item.quantity}</td>
              <td className="border border-gray-300 p-2">{formatCurrency(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}