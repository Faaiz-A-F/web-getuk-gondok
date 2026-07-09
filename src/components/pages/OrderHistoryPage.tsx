"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Package, Clock, Truck, DollarSign, Search, Filter, ChevronDown, FileText, RefreshCw, HelpCircle, X } from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    name: string;
    images?: { url: string }[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export function OrderHistoryPage() {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?userId=${user.id}`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.error("Error fetching orders:", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "done":
      case "delivered":
        return { label: "Selesai", className: "bg-green-100 text-green-700", dotColor: "bg-green-500" };
      case "shipped":
      case "sent":
        return { label: "Dikirim", className: "bg-amber-100 text-amber-700", dotColor: "bg-amber-500" };
      case "pending":
      case "processing":
        return { label: "Diproses", className: "bg-yellow-100 text-yellow-700", dotColor: "bg-yellow-500" };
      case "cancelled":
        return { label: "Dibatalkan", className: "bg-red-100 text-red-700", dotColor: "bg-red-500" };
      default:
        return { label: status, className: "bg-gray-100 text-gray-700", dotColor: "bg-gray-500" };
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status.toLowerCase() === "pending" || o.status.toLowerCase() === "processing").length;
  const shippedOrders = orders.filter((o) => o.status.toLowerCase() === "shipped" || o.status.toLowerCase() === "sent").length;
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Login Diperlukan</h2>
          <p className="text-amber-700 mb-6">Silakan login untuk melihat riwayat pesanan Anda</p>
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            Login Sekarang
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Riwayat Pesanan</h1>
          <p className="text-amber-200">Lacak dan kelola semua pesanan Anda</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 -mt-4">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-amber-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-amber-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Diproses</option>
                <option value="shipped">Dikirim</option>
                <option value="done">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
              <input
                type="text"
                placeholder="Cari nomor pesanan atau produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-amber-400 hover:text-amber-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-amber-700" />
            </div>
            <p className="text-3xl font-bold text-amber-900">{totalOrders}</p>
            <p className="text-sm text-amber-600">Total Pesanan</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-amber-900">{pendingOrders}</p>
            <p className="text-sm text-amber-600">Sedang Diproses</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-amber-900">{shippedOrders}</p>
            <p className="text-sm text-amber-600">Dalam Pengiriman</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-amber-900">
              {totalSpent >= 1000000 ? `Rp ${(totalSpent / 1000000).toFixed(1)}M` : formatPrice(totalSpent)}
            </p>
            <p className="text-sm text-amber-600">Total Belanja</p>
          </div>
        </div>

        {/* Order List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-amber-100">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Belum ada pesanan</h3>
            <p className="text-amber-600 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Tidak ada pesanan yang cocok dengan filter Anda"
                : "Mulai belanja untuk melihat pesanan di sini"}
            </p>
            <a
              href="/catalogue"
              className="inline-block px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-full transition-all shadow-lg"
            >
              Mulai Belanja
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isExpanded = expandedOrder === order.id;

              return (
                <article
                  key={order.id}
                  className="bg-white rounded-2xl shadow-md border border-amber-100 overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Order Header */}
                  <div className="p-5 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-amber-900">{order.orderNumber}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-amber-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${statusConfig.className}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}></span>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-amber-50 rounded-xl">
                          <div className="w-16 h-16 bg-amber-200 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product?.images?.[0]?.url ? (
                              <Image
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-amber-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-amber-900 truncate">{item.product?.name || "Produk"}</p>
                            <p className="text-sm text-amber-600">
                              Qty: {item.quantity} × {formatPrice(Number(item.price))}
                            </p>
                          </div>
                          <p className="font-bold text-amber-900">{formatPrice(Number(item.subtotal))}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="px-5 py-4 bg-amber-50 border-t border-amber-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-xs text-amber-600 uppercase tracking-wide">Total Pesanan</p>
                      <p className="text-2xl font-bold text-amber-900">{formatPrice(Number(order.totalAmount))}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors font-medium">
                        <FileText className="w-4 h-4" />
                        Detail
                      </button>
                      {order.status.toLowerCase() === "done" && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-xl hover:bg-amber-800 transition-colors font-medium">
                          <RefreshCw className="w-4 h-4" />
                          Beli Lagi
                        </button>
                      )}
                      {(order.status.toLowerCase() === "shipped" || order.status.toLowerCase() === "sent") && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-xl hover:bg-amber-800 transition-colors font-medium">
                          <Truck className="w-4 h-4" />
                          Lacak
                        </button>
                      )}
                      {order.status.toLowerCase() === "pending" && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
                          <X className="w-4 h-4" />
                          Batalkan
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
