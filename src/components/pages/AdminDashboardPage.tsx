"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeaderLandingPage } from "@/components/layout/HeaderLandingPage";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  FileBarChart,
  LayoutDashboard,
  Package,
  Printer,
  Receipt,
  ShoppingCart,
  Check,
  X,
  Users,
  Plus,
  Edit,
  Trash2,
  Key,
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Clock,
  Filter,
  XCircle,
  FileDown,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF";

type TabType = "dashboard" | "orders" | "financial" | "layout" | "users" | "products";

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalProductsSold: number;
  storeOrders: number;
  houseOrders: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    userName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  user: { 
    name: string; 
    email: string;
    phone?: string | null;
    address?: string | null;
  };
  items: Array<{ quantity: number; price: number; subtotal?: number; product: { name: string } }>;
  notes?: string;
}

interface SiteContent {
  [key: string]: Array<{ id: string; key: string; value: string; label: string }>;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  role: 'ADMIN' | 'CUSTOMER';
  createdAt: string;
  updatedAt: string;
  orderCount: number;
  isMainAdmin: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  weight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string };
  images: Array<{ id: string; url: string; alt: string | null; isPrimary: boolean }>;
  _count?: { orderItems: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { products: number };
}

const DashboardContent = ({ data }: { data: DashboardData | null }) => {
  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-amber-200 bg-white/80 shadow-sm">
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={<ShoppingCart size={20} />} 
          title="TOKO (Hari Ini)" 
          value={data.storeOrders.toString()} 
          trend="up" 
          percentage="0%" 
          color="#f59e0b" 
        />
        <StatCard 
          icon={<ShoppingCart size={20} />} 
          title="RUMAH PRODUKSI (Hari Ini)" 
          value={data.houseOrders.toString()} 
          trend="up" 
          percentage="0%" 
          color="#d97706" 
        />
        <StatCard 
          icon={<DollarSign size={20} />} 
          title="PENDAPATAN (Hari Ini)" 
          value={formatCurrency(data.totalRevenue)} 
          trend="up" 
          percentage="0%" 
          color="#10b981" 
        />
        <StatCard 
          icon={<Package size={20} />} 
          title="TERJUAL (Hari Ini)" 
          value={data.totalProductsSold.toString()} 
          trend="up" 
          percentage="0%" 
          color="#f6b739" 
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/95 p-6 shadow-lg transition-all duration-500 hover:shadow-xl hover:border-amber-300 lg:col-span-2">
          {/* Decorative corner */}
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-amber-100/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-amber-950">Monthly Earning</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pendapatan bulanan</p>
            </div>
            <span className="group/btn relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
              <span className="relative z-10 flex items-center gap-1">
                <Activity size={12} className="animate-pulse" />
                Live Update
              </span>
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.revenueByMonth}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
              <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={2} fill="url(#colorArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders Section */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/95 p-6 shadow-lg transition-all duration-500 hover:shadow-xl hover:border-amber-300">
          {/* Decorative corner */}
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-amber-100/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-amber-950">Recent Orders</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pesanan terbaru</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              <Clock size={12} />
              Today
            </span>
          </div>
          <div className="space-y-3">
            {data.recentOrders.slice(0, 5).map((order, index) => (
              <div 
                key={order.id} 
                className="group/item group flex items-center justify-between rounded-xl border border-amber-100/60 bg-gradient-to-r from-amber-50/50 to-white/50 p-3 transition-all duration-300 hover:border-amber-200 hover:bg-amber-50/70 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-700 font-bold text-sm shadow-inner">
                    {order.orderNumber.slice(-3)}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 text-sm">{order.orderNumber}</span>
                    <p className="text-xs text-slate-500">{order.userName}</p>
                  </div>
                </div>
                <span className="font-bold text-amber-700 text-sm group-hover/item:text-amber-900 transition-colors">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
const OrderDetailModal = ({ 
  isOpen, 
  onClose, 
  order,
  onUpdateStatus,
  onPrintReceipt
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  order: Order | null;
  onUpdateStatus: (id: string, status: string) => void;
  onPrintReceipt: (order: Order) => void;
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'DONE': return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Menunggu Pembayaran';
      case 'PAID': return 'Sudah Dibayar';
      case 'DONE': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
  };

  if (!isOpen || !order) return null;

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === 'CANCELLED') {
      if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
        onUpdateStatus(order.id, newStatus);
        onClose();
      }
    } else {
      onUpdateStatus(order.id, newStatus);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-amber-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">📋 Detail Pesanan</h3>
              <p className="text-amber-100 text-xs mt-1">{order.orderNumber}</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Status Banner */}
          <div className={`flex items-center justify-between rounded-xl p-4 ${getStatusColor(order.status)}`}>
            <div className="flex items-center gap-3">
              {order.status === 'PENDING' && <Clock size={20} />}
              {order.status === 'PAID' && <DollarSign size={20} />}
              {order.status === 'DONE' && <Check size={20} />}
              {order.status === 'CANCELLED' && <XCircle size={20} />}
              <span className="font-bold text-sm">{getStatusLabel(order.status)}</span>
            </div>
            <span className="text-xs opacity-75">
              {new Date(order.createdAt).toLocaleString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-amber-200 p-4">
            <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
              <Users size={16} />
              Informasi Pelanggan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Nama</p>
                  <p className="font-semibold text-slate-800">{order.user.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-semibold text-slate-800">{order.user.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">No. Telepon</p>
                  <p className="font-semibold text-slate-800">{order.user.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Alamat</p>
                  <p className="font-semibold text-slate-800">{order.user.address || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-amber-200 p-4">
            <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
              <Package size={16} />
              Item Pesanan
            </h4>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-amber-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{item.product?.name || 'Produk'}</p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(item.subtotal || (item.quantity * item.price))}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Tidak ada item</p>
              )}
            </div>
            
            {/* Total */}
            <div className="mt-4 pt-4 border-t-2 border-amber-300 flex justify-between items-center">
              <span className="font-bold text-amber-900">Total Pesanan</span>
              <span className="text-xl font-bold text-emerald-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-amber-200 p-4">
              <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                <FileBarChart size={16} />
                Catatan Pesanan
              </h4>
              <p className="text-sm text-slate-600 bg-amber-50 rounded-lg p-3">{order.notes}</p>
            </div>
          )}

          {/* Update Status Section */}
          <div className="bg-white rounded-xl border border-amber-200 p-4">
            <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
              <Activity size={16} />
              Update Status Pesanan
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'PENDING', label: '⏳ Menunggu', color: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
                { value: 'PAID', label: '💰 Dibayar', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
                { value: 'DONE', label: '✅ Selesai', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
                { value: 'CANCELLED', label: '❌ Batal', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={order.status === status.value}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    order.status === status.value 
                      ? `${status.color} opacity-50 cursor-not-allowed` 
                      : `${status.color} cursor-pointer`
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-amber-200 bg-gradient-to-br from-white to-amber-50">
          <button
            onClick={() => onPrintReceipt(order)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all font-semibold shadow-lg shadow-emerald-200"
          >
            <FileDown size={18} />
            Download Struk / PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

const OrdersContent = ({ orders, loading, onUpdateStatus, onPrintReceipt, onViewDetail }: { 
  orders: Order[]; 
  loading: boolean;
  onUpdateStatus: (id: string, status: string) => void;
  onPrintReceipt: (order: Order) => void;
  onViewDetail: (order: Order) => void;
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'DONE': return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Menunggu Pembayaran';
      case 'PAID': return 'Sudah Dibayar';
      case 'DONE': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
  };

  // Filter orders based on selected status and date
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesDate = orderDate === dateFilter;
    return matchesStatus && matchesDate;
  });

  // Count orders by status for the selected date
  const orderCounts = {
    ALL: orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === dateFilter).length,
    PENDING: orders.filter(o => o.status === 'PENDING' && new Date(o.createdAt).toISOString().split('T')[0] === dateFilter).length,
    PAID: orders.filter(o => o.status === 'PAID' && new Date(o.createdAt).toISOString().split('T')[0] === dateFilter).length,
    DONE: orders.filter(o => o.status === 'DONE' && new Date(o.createdAt).toISOString().split('T')[0] === dateFilter).length,
    CANCELLED: orders.filter(o => o.status === 'CANCELLED' && new Date(o.createdAt).toISOString().split('T')[0] === dateFilter).length,
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-amber-200 bg-white/80 shadow-sm">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200/60 bg-white/95 shadow-lg transition-all duration-500">
      {/* Header */}
      <div className="border-b border-amber-100/60 bg-gradient-to-r from-amber-50/80 to-white/80 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-amber-950">Daftar Pesanan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kelola semua pesanan pelanggan</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Filter */}
            <div className="flex items-center gap-2 bg-white rounded-xl border-2 border-amber-200 px-4 py-2 shadow-sm">
              <Calendar size={18} className="text-amber-600" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-sm font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
              />
            </div>
            <span className="flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
              <Receipt size={18} />
              {filteredOrders.length} Pesanan
            </span>
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter size={14} />
            <span>Filter Status:</span>
          </div>
          {[
            { value: 'ALL', label: `Semua (${orderCounts.ALL})` },
            { value: 'PENDING', label: `Menunggu (${orderCounts.PENDING})` },
            { value: 'PAID', label: `Dibayar (${orderCounts.PAID})` },
            { value: 'DONE', label: `Selesai (${orderCounts.DONE})` },
            { value: 'CANCELLED', label: `Batal (${orderCounts.CANCELLED})` },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                statusFilter === filter.value
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-50 to-amber-100/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Order Number</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Total</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100/50">
            {filteredOrders.map((order, index) => (
              <tr key={order.id} className="group transition-all duration-300 hover:bg-amber-50/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-700 font-bold text-sm shadow-inner">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">{order.orderNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-600 font-semibold text-white text-sm">
                      {order.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 text-sm">{order.user.name}</div>
                      <div className="text-xs text-slate-400">{order.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold leading-tight shadow-sm ${getStatusColor(order.status)}`}>
                    {order.status === 'PENDING' && <Clock size={12} />}
                    {order.status === 'PAID' && <DollarSign size={12} />}
                    {order.status === 'DONE' && <Check size={12} />}
                    {order.status === 'CANCELLED' && <XCircle size={12} />}
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">{formatCurrency(order.totalAmount)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar size={14} />
                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (newStatus !== order.status) {
                            if (newStatus === 'CANCELLED') {
                              if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
                                onUpdateStatus(order.id, newStatus);
                              }
                            } else {
                              onUpdateStatus(order.id, newStatus);
                            }
                          }
                        }}
                        className={`appearance-none rounded-xl px-3 py-2 pr-8 text-xs font-semibold border-2 cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusColor(order.status)} border-transparent hover:border-opacity-50`}
                        style={{ minWidth: '120px' }}
                      >
                        <option value="PENDING" className="bg-amber-50 text-amber-800">⏳ Menunggu</option>
                        <option value="PAID" className="bg-blue-50 text-blue-800">💰 Dibayar</option>
                        <option value="DONE" className="bg-emerald-50 text-emerald-800">✅ Selesai</option>
                        <option value="CANCELLED" className="bg-red-50 text-red-800">❌ Batal</option>
                      </select>
                      <ChevronRight size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none rotate-90 opacity-70" />
                    </div>
                    <button
                      onClick={() => onViewDetail(order)}
                      className="group/btn rounded-xl px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 font-semibold text-sm"
                      title="Lihat Detail"
                    >
                      <FileBarChart size={18} />
                      <span>Detail</span>
                    </button>
                    <button
                      onClick={() => onPrintReceipt(order)}
                      className="group/btn rounded-xl px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 font-semibold text-sm"
                      title="Download PDF Struk"
                    >
                      <FileDown size={18} />
                      <span>PDF</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                      <Receipt size={32} className="text-amber-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Belum ada pesanan</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FinancialContent = ({ orders }: { orders: Order[] }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'PAID' || o.status === 'DONE')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'DONE').length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  const ordersByMonth = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { count: 0, revenue: 0 };
    }
    acc[month].count += 1;
    if (order.paymentStatus === 'PAID' || order.status === 'DONE') {
      acc[month].revenue += Number(order.totalAmount);
    }
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-amber-500">
          <h4 className="text-sm text-gray-500 mb-2">Total Revenue</h4>
          <p className="text-2xl font-bold text-amber-700">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-amber-600">
          <h4 className="text-sm text-gray-500 mb-2">Total Orders</h4>
          <p className="text-2xl font-bold text-amber-600">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <h4 className="text-sm text-gray-500 mb-2">Completed</h4>
          <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h4 className="text-sm text-gray-500 mb-2">Pending</h4>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>

        {/* Total Orders */}
        <div className="group relative overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white to-blue-50/30 p-5 shadow-md transition-all duration-500 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-blue-100/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-600">Total Pesanan</p>
              <p className="mt-2 text-xl font-bold text-slate-800">{totalOrders}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-inner">
              <Receipt size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600">
            <Package size={14} />
            <span>Semua pesanan</span>
          </div>
        </div>

        {/* Completed */}
        <div className="group relative overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-white to-violet-50/30 p-5 shadow-md transition-all duration-500 hover:shadow-xl hover:border-violet-300 hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-violet-100/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-violet-600">Selesai</p>
              <p className="mt-2 text-xl font-bold text-slate-800">{completedOrders}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 shadow-inner">
              <Check size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-600">
            <TrendingUp size={14} />
            <span>Pesanan selesai</span>
          </div>
        </div>

        {/* Pending */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white to-amber-50/30 p-5 shadow-md transition-all duration-500 hover:shadow-xl hover:border-amber-300 hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-100/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-600">Menunggu</p>
              <p className="mt-2 text-xl font-bold text-slate-800">{pendingOrders}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-inner">
              <Clock size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-600">
            <Activity size={14} />
            <span>Perlu diproses</span>
          </div>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/95 p-6 shadow-lg transition-all duration-500 hover:shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-amber-950">Revenue by Month</h3>
            <p className="text-xs text-slate-500 mt-0.5">Pendapatan berdasarkan bulan</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5">
            <FileBarChart size={14} className="text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">{Object.keys(ordersByMonth).length} Bulan</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/50">
              {Object.entries(ordersByMonth).map(([month, data]) => (
                <tr key={month} className="hover:bg-amber-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">{data.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700 font-semibold">{formatCurrency(data.revenue)}</td>
                </tr>
              ))}
              {Object.keys(ordersByMonth).length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <FileBarChart size={32} className="text-amber-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Belum ada data keuangan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LayoutContent = ({ siteContent, onUpdate }: { siteContent: SiteContent | null; onUpdate: (key: string, value: string) => void }) => {
  if (!siteContent) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-amber-200 bg-white/80 shadow-sm">
        <p className="text-gray-500">Loading site content...</p>
      </div>
    );
  }

  const highlightProducts = siteContent['highlight'] || [];
  const heroSection = siteContent['hero'] || [];

  return (
    <div className="space-y-6">
      {/* Highlight Products */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/95 p-6 shadow-lg transition-all duration-500 hover:shadow-xl">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-100/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-amber-950">Highlight Products</h3>
            <p className="text-xs text-slate-500 mt-0.5">Konfigurasi produk yang ditampilkan di halaman utama</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-inner">
            <Package size={20} />
          </div>
        </div>
        {highlightProducts.length > 0 ? (
          <div className="space-y-4">
            {highlightProducts.map((item, index) => (
              <div key={item.id} className="group/item relative overflow-hidden rounded-xl border border-amber-100/60 bg-gradient-to-r from-amber-50/50 to-white/50 p-4 transition-all duration-300 hover:border-amber-200 hover:bg-amber-50/70">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold shadow-md">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-slate-700">{item.label}</label>
                    <input
                      type="text"
                      defaultValue={item.value}
                      onBlur={(e) => onUpdate(item.key, e.target.value)}
                      className="mt-1.5 w-full rounded-lg border-2 border-amber-200 bg-white px-4 py-2.5 text-slate-700 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-200 placeholder:text-slate-400"
                      placeholder="Product ID atau slug"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/30 py-12">
            <Package size={40} className="text-amber-300" />
            <p className="text-sm text-slate-500">Belum ada produk highlight dikonfigurasi</p>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/95 p-6 shadow-lg transition-all duration-500 hover:shadow-xl">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-100/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-amber-950">Hero Section</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kelola konten bagian utama website</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 shadow-inner">
            <LayoutDashboard size={20} />
          </div>
        </div>
        {heroSection.length > 0 ? (
          <div className="space-y-4">
            {heroSection.map((item) => (
              <div key={item.id} className="group/item relative overflow-hidden rounded-xl border border-amber-100/60 bg-gradient-to-r from-amber-50/50 to-white/50 p-4 transition-all duration-300 hover:border-amber-200 hover:bg-amber-50/70">
                <label className="mb-2 block text-sm font-semibold text-slate-700">{item.label}</label>
                <textarea
                  defaultValue={item.value}
                  onBlur={(e) => onUpdate(item.key, e.target.value)}
                  className="w-full rounded-lg border-2 border-amber-200 bg-white px-4 py-2.5 text-slate-700 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-200 resize-none placeholder:text-slate-400"
                  rows={3}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/30 py-12">
            <LayoutDashboard size={40} className="text-amber-300" />
            <p className="text-sm text-slate-500">Belum ada konten hero section</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductsContent = ({
  products,
  categories,
  loading,
  onRefresh,
  onEdit,
  onDelete,
  onToggleActive,
  onCreate
}: {
  products: Product[];
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleActive: (productId: string, isActive: boolean) => void;
  onCreate: () => void;
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<string>('ALL');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'ALL' || product.category.slug === categoryFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = isActiveFilter === 'ALL' || 
      (isActiveFilter === 'ACTIVE' && product.isActive) ||
      (isActiveFilter === 'INACTIVE' && !product.isActive);
    return matchesCategory && matchesSearch && matchesActive;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-amber-200 bg-white/80 shadow-sm">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/95 p-5 shadow-lg transition-all duration-500 hover:shadow-xl">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-100/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-950">Daftar Produk</h3>
              <p className="text-xs text-slate-500">Kelola semua produk di katalog</p>
            </div>
          </div>
          <button
            onClick={onCreate}
            className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-amber-700 hover:to-amber-800"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={18} className="transition-transform duration-300 group-hover/btn:rotate-90" />
              Tambah Produk
            </span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-2 border-amber-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-200 placeholder:text-slate-400"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border-2 border-amber-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition-all focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          <select
            value={isActiveFilter}
            onChange={(e) => setIsActiveFilter(e.target.value)}
            className="rounded-lg border-2 border-amber-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition-all focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/95 shadow-lg transition-all duration-500 hover:shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-50 to-amber-100/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Produk</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Kategori</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Harga</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Stok</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="group transition-all duration-300 hover:bg-amber-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-amber-100">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package size={24} className="m-auto text-amber-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{product.description?.substring(0, 50)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      product.stock > 10 ? 'bg-emerald-100 text-emerald-700' :
                      product.stock > 0 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.stock} pcs
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleActive(product.id, !product.isActive)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        product.isActive 
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {product.isActive ? (
                        <>
                          <Check size={12} />
                          Aktif
                        </>
                      ) : (
                        <>
                          <X size={12} />
                          Tidak Aktif
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {product._count?.orderItems || 0} orders
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEdit(product)}
                        className="group/btn rounded-xl p-2.5 text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:scale-110 hover:shadow-lg"
                        title="Edit Produk"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                            onDelete(product.id);
                          }
                        }}
                        className="group/btn rounded-xl p-2.5 text-rose-600 transition-all duration-300 hover:bg-rose-50 hover:scale-110 hover:shadow-lg"
                        title="Hapus Produk"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <Package size={32} className="text-amber-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Belum ada produk</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({
  isOpen,
  onClose,
  product,
  categories,
  onSubmit,
  loading
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSubmit: (data: any) => void;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    weight: '',
    categoryId: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock: product.stock.toString(),
        weight: product.weight.toString(),
        categoryId: product.category.id,
        imageUrl: product.images?.[0]?.url || '',
        isActive: product.isActive,
      });
    } else if (isOpen && !product) {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        weight: '',
        categoryId: categories[0]?.id || '',
        imageUrl: '',
        isActive: true,
      });
    }
  }, [isOpen, product, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl w-full max-w-lg max-h-[90vh] shadow-2xl border border-amber-200 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">{product ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}</h3>
              <p className="text-amber-100 text-xs mt-1">Lengkapi form di bawah ini</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Nama Produk</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black"
              placeholder="Masukkan nama produk"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Kategori</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black cursor-pointer"
            >
              <option value="">Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Harga (Rp)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Stok</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Berat (gram)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">URL Gambar</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black"
              placeholder="/products/1.webp"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none bg-white text-black"
              rows={3}
              placeholder="Masukkan deskripsi produk"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {formData.isActive ? 'Produk Aktif' : 'Produk Tidak Aktif'}
            </span>
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-gradient-to-br from-white to-amber-50 -mx-6 px-6 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-amber-200"
            >
              {loading ? '⏳ Menyimpan...' : (product ? '💾 Simpan' : '✅ Buat Produk')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UsersContent = ({ 
  users, 
  loading, 
  onRefresh,
  onEdit,
  onDelete,
  onResetPassword,
  onCreate 
}: { 
  users: AdminUser[]; 
  loading: boolean;
  onRefresh: () => void;
  onEdit: (user: AdminUser) => void;
  onDelete: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onCreate: () => void;
}) => {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-amber-200 bg-white/80 shadow-sm">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/95 p-5 shadow-lg transition-all duration-500 hover:shadow-xl">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-100/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-950">Daftar User</h3>
              <p className="text-xs text-slate-500">Kelola semua user dan admin sistem</p>
            </div>
          </div>
          <button
            onClick={onCreate}
            className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-amber-700 hover:to-amber-800"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={18} className="transition-transform duration-300 group-hover/btn:rotate-90" />
              Tambah User
            </span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/95 shadow-lg transition-all duration-500 hover:shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-50 to-amber-100/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Nama</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Tanggal Daftar</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/50">
              {users.map((user, index) => (
                <tr key={user.id} className="group transition-all duration-300 hover:bg-amber-50/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 font-bold text-white shadow-md transition-all duration-300 group-hover:scale-110">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.isMainAdmin && (
                          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                            <Shield size={10} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        {user.isMainAdmin && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <Shield size={10} />
                            Main Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{user.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'ADMIN' ? <Shield size={12} /> : <Users size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      <Receipt size={12} />
                      {user.orderCount} Pesanan
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!user.isMainAdmin ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEdit(user)}
                          className="group/btn rounded-xl p-2.5 text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:scale-110 hover:shadow-lg"
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onResetPassword(user.id)}
                          className="group/btn rounded-xl p-2.5 text-amber-600 transition-all duration-300 hover:bg-amber-50 hover:scale-110 hover:shadow-lg"
                          title="Reset Password"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(user.id)}
                          className="group/btn rounded-xl p-2.5 text-rose-600 transition-all duration-300 hover:bg-rose-50 hover:scale-110 hover:shadow-lg"
                          title="Hapus User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400">
                        <Shield size={12} />
                        Protected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <Users size={32} className="text-amber-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Belum ada user</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UserModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onSubmit,
  loading
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  user: AdminUser | null;
  onSubmit: (data: any) => void;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    role: 'CUSTOMER' as 'ADMIN' | 'CUSTOMER',
  });

  // Reset form when modal opens for new user
  useEffect(() => {
    if (isOpen && !user) {
      // Only reset when opening for NEW user (user prop is null)
      setFormData({
        email: '',
        password: '',
        name: '',
        phone: '',
        address: '',
        role: 'CUSTOMER',
      });
    } else if (isOpen && user) {
      // Fill form with user data for EDIT
      setFormData({
        email: user.email,
        password: '',
        name: user.name,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role,
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl w-full max-w-md max-h-[90vh] shadow-2xl border border-amber-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">{user ? '✏️ Edit User' : '➕ Tambah User Baru'}</h3>
              <p className="text-amber-100 text-xs mt-1">Lengkapi form di bawah ini</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black placeholder-gray-400"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black placeholder-gray-400"
              placeholder="email@example.com"
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black placeholder-gray-400"
                placeholder="Minimal 6 karakter"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Pilih Role / Jabatan</label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'CUSTOMER' })}
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white appearance-none cursor-pointer text-base font-medium text-black"
              >
                <option value="CUSTOMER" className="text-base py-2">👤 User / Customer - Pembeli di website</option>
                <option value="ADMIN" className="text-base py-2">🛡️ Admin - Pengelola website</option>
              </select>
              <ChevronRight size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 rotate-90 pointer-events-none" />
            </div>
            <p className="text-xs text-gray-500 mt-1">User bisa belanja, Admin bisa mengelola website</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">No. Telepon <span className="text-gray-400 font-normal">(Opsional)</span></label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black placeholder-gray-400"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Alamat <span className="text-gray-400 font-normal">(Opsional)</span></label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none text-black placeholder-gray-400"
              rows={2}
              placeholder="Alamat lengkap"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-gradient-to-br from-white to-amber-50 -mx-6 px-6 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-amber-200"
            >
              {loading ? '⏳ Menyimpan...' : (user ? '💾 Simpan' : '✅ Buat User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordModal = ({ 
  isOpen, 
  onClose, 
  userName,
  onSubmit,
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  userName: string;
  onSubmit: (password: string) => void;
  loading: boolean;
}) => {
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setNewPassword('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl w-full max-w-md shadow-2xl border border-amber-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">🔑 Reset Password</h3>
              <p className="text-amber-100 text-xs mt-1">Ubah password user {userName}</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Password Baru</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white text-black"
                placeholder="Minimal 6 karakter"
              />
              <p className="text-xs text-gray-500 mt-1">Gunakan kombinasi huruf dan angka</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || newPassword.length < 6}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-amber-200"
              >
                {loading ? '⏳ Mereset...' : '🔄 Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  userName,
  onConfirm,
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  userName: string;
  onConfirm: () => void;
  loading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl w-full max-w-md shadow-2xl border border-red-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">⚠️ Konfirmasi Hapus</h3>
              <p className="text-red-100 text-xs mt-1">Tindakan ini tidak dapat dibatalkan</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Apakah Anda yakin ingin menghapus user:</p>
              <p className="font-bold text-gray-900">{userName}</p>
            </div>
          </div>
          
          <p className="text-xs text-red-500 bg-red-50 rounded-lg p-3 mb-4">
            ⚠️ Peringatan: Semua data user ini akan dihapus permanen dari sistem.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-red-200"
            >
              {loading ? '⏳ Menghapus...' : '🗑️ Hapus User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavBar = ({ activeTab, onTabChange }: { activeTab: TabType; onTabChange: (tab: TabType) => void }) => {
  const menuItems: { id: TabType; icon: React.ElementType; label: string }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Package, label: "Produk" },
    { id: "orders", icon: Receipt, label: "Pesanan" },
    { id: "financial", icon: FileBarChart, label: "Laporan Keuangan" },
    { id: "layout", icon: LayoutDashboard, label: "Layout" },
    { id: "users", icon: Users, label: "User Management" },
  ];

  return (
    <nav className="flex h-14 items-center gap-0 border-b border-amber-800 bg-amber-700 px-8 lg:px-32.5">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm transition-all ${
            activeTab === item.id ? "border-amber-300 text-white font-semibold" : "border-transparent text-white/80 hover:text-white hover:bg-amber-600/50"
          }`}
        >
          <item.icon size={16} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

const getContentByTab = (tab: TabType, props: any) => {
  switch (tab) {
    case "dashboard":
      return <DashboardContent data={props.dashboardData} />;
    case "products":
      return (
        <ProductsContent
          products={props.products}
          categories={props.categories}
          loading={props.productsLoading}
          onRefresh={props.onRefreshProducts}
          onEdit={props.onEditProduct}
          onDelete={props.onDeleteProduct}
          onToggleActive={props.onToggleProductActive}
          onCreate={props.onCreateProduct}
        />
      );
    case "orders":
      return <OrdersContent orders={props.orders} loading={props.loading} onUpdateStatus={props.onUpdateStatus} onPrintReceipt={props.onPrintReceipt} onViewDetail={props.onViewOrderDetail} />;
    case "financial":
      return <FinancialContent orders={props.orders} />;
    case "layout":
      return <LayoutContent siteContent={props.siteContent} onUpdate={props.onUpdateSiteContent} />;
    case "users":
      return (
        <UsersContent 
          users={props.users} 
          loading={props.usersLoading}
          onRefresh={props.onRefreshUsers}
          onEdit={props.onEditUser}
          onDelete={props.onDeleteUser}
          onResetPassword={props.onResetPasswordUser}
          onCreate={props.onCreateUser}
        />
      );
    default:
      return <DashboardContent data={props.dashboardData} />;
  }
};

interface StatCardProps {
  title: string;
  value: string;
  trend: "up" | "down";
  percentage: string;
  color: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, trend, percentage, color, icon }: StatCardProps) => (
  <div className="relative flex h-40 flex-col justify-between overflow-hidden rounded-md bg-gradient-to-br from-amber-600 to-amber-700 p-6 shadow-lg">
    <div
      className="absolute right-0 top-0 px-3 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: color, clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)", paddingRight: "16px" }}
    >
      {trend === "up" ? "+" : ""}{percentage}
    </div>
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white">{icon}</div>
    <div>
      <p className="mb-2 text-xs tracking-wide text-amber-100">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-semibold text-white">{value}</h3>
        {trend === "up" ? <ArrowUp size={16} className="text-amber-200" /> : <ArrowDown size={16} className="text-red-200" />}
      </div>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-xs text-amber-200">Since last month</p>
      <ChevronRight size={16} className="text-amber-200" />
    </div>
  </div>
);

export function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  // User management state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Products management state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Order detail state
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Handler for viewing order details
  const handleViewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  // Get user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      if (user.role !== 'ADMIN') return;

      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${user.id}` }
        });
        
        if (response.status === 403) {
          console.error('Access denied: User is not an admin or session expired');
          // Clear invalid session
          localStorage.removeItem('user');
          window.location.href = '/error?message=Access+denied:+You+do+not+have+admin+privileges';
          return;
        }
        
        if (response.status === 401) {
          console.error('Unauthorized: Please login again');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        
        const data = await response.json();
        
        if (response.ok) {
          // Calculate today's stats
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const todayOrders = data.recentOrders?.filter((o: any) => new Date(o.createdAt) >= today) || [];
          const storeOrders = Math.floor(todayOrders.length * 0.6); // Mock distribution
          const houseOrders = todayOrders.length - storeOrders;
          const totalRevenue = todayOrders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
          
          setDashboardData({
            ...data,
            storeOrders,
            houseOrders,
            totalRevenue,
            totalProductsSold: todayOrders.length * 3, // Mock: 3 products per order
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch orders when orders tab is active
  useEffect(() => {
    const fetchOrders = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      if (user.role !== 'ADMIN') return;

      try {
        setLoading(true);
        const response = await fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${user.id}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setOrders(data.orders || data || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'orders' || activeTab === 'financial') {
      fetchOrders();
    }
  }, [activeTab]);

  // Fetch site content when layout tab is active
  useEffect(() => {
    const fetchSiteContent = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      if (user.role !== 'ADMIN') return;

      try {
        const response = await fetch('/api/admin/site-content', {
          headers: { 'Authorization': `Bearer ${user.id}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setSiteContent(data);
        }
      } catch (error) {
        console.error('Failed to fetch site content:', error);
      }
    };

    if (activeTab === 'layout') {
      fetchSiteContent();
    }
  }, [activeTab]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const user = JSON.parse(userData);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleUpdateSiteContent = async (key: string, value: string) => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/admin/site-content', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        console.error('Failed to update site content');
      }
    } catch (error) {
      console.error('Failed to update site content:', error);
    }
  };

  const handlePrintReceipt = (order: Order) => {
    // Redirect to invoice preview page with order ID
    const orderId = btoa(JSON.stringify(order.id));
    router.push(`/invoice-preview?order=${orderId}`);
  };

  // Fetch users when users tab is active
  useEffect(() => {
    const fetchUsers = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const adminUser = JSON.parse(userData);
      if (adminUser.role !== 'ADMIN') return;

      try {
        setUsersLoading(true);
        const response = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${adminUser.id}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // User management handlers
  const handleRefreshUsers = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const adminUser = JSON.parse(userData);

    try {
      setUsersLoading(true);
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${adminUser.id}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to refresh users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateUser = () => {
    // Just open the modal - form will be reset by UserModal's useEffect
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleResetPasswordUser = (userId: string) => {
    const userToReset = users.find(u => u.id === userId);
    if (userToReset) {
      setSelectedUser(userToReset);
      setIsResetPasswordModalOpen(true);
    }
  };

  const handleUserSubmit = async (formData: any) => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const adminUser = JSON.parse(userData);

    try {
      setModalLoading(true);
      const url = selectedUser ? `/api/admin/users/${selectedUser.id}` : '/api/admin/users';
      const method = selectedUser ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser.id}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsUserModalOpen(false);
        handleRefreshUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save user');
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('Failed to save user');
    } finally {
      setModalLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (newPassword: string) => {
    if (!selectedUser) return;

    const userData = localStorage.getItem('user');
    if (!userData) return;

    const adminUser = JSON.parse(userData);

    try {
      setModalLoading(true);
      const response = await fetch(`/api/admin/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser.id}`
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        setIsResetPasswordModalOpen(false);
        alert('Password reset successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    const userData = localStorage.getItem('user');
    if (!userData) return;

    const adminUser = JSON.parse(userData);

    try {
      setModalLoading(true);
      const response = await fetch(`/api/admin/users/${userToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminUser.id}`
        },
      });

      if (response.ok) {
        setIsDeleteModalOpen(false);
        handleRefreshUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    } finally {
      setModalLoading(false);
    }
  };

  // Fetch products and categories when products tab is active
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const adminUser = JSON.parse(userData);
      if (adminUser.role !== 'ADMIN') return;

      try {
        setProductsLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('/api/admin/products', {
          headers: { 'Authorization': `Bearer ${adminUser.id}` }
        });
        const productsData = await productsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories', {
          headers: { 'Authorization': `Bearer ${adminUser.id}` }
        });
        const categoriesData = await categoriesResponse.json();
        
        if (productsResponse.ok) {
          setProducts(productsData.products || productsData || []);
        }
        if (categoriesResponse.ok) {
          setCategories(categoriesData.categories || categoriesData || []);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    if (activeTab === 'products') {
      fetchProductsAndCategories();
    }
  }, [activeTab]);

  // Products management handlers
  const handleRefreshProducts = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const adminUser = JSON.parse(userData);

    try {
      setProductsLoading(true);
      const response = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${adminUser.id}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || data || []);
      }
    } catch (error) {
      console.error('Failed to refresh products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const adminUser = JSON.parse(userData);

    try {
      setModalLoading(true);
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminUser.id}`
        },
      });

      if (response.ok) {
        handleRefreshProducts();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleProductActive = async (productId: string, isActive: boolean) => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const adminUser = JSON.parse(userData);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser.id}`
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setProducts(products.map(p => p.id === productId ? { ...p, isActive } : p));
      }
    } catch (error) {
      console.error('Failed to toggle product active:', error);
    }
  };

  const handleProductSubmit = async (formData: any) => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const adminUser = JSON.parse(userData);

    try {
      setModalLoading(true);
      const url = selectedProduct ? `/api/admin/products/${selectedProduct.id}` : '/api/admin/products';
      const method = selectedProduct ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser.id}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          weight: parseFloat(formData.weight),
          images: formData.imageUrl ? [{ url: formData.imageUrl, alt: formData.name, isPrimary: true }] : [],
        }),
      });

      if (response.ok) {
        setIsProductModalOpen(false);
        handleRefreshProducts();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <HeaderLandingPage />
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="space-y-7 px-8 py-6 lg:px-32.5">
        {getContentByTab(activeTab, {
          dashboardData,
          orders,
          siteContent,
          loading,
          users,
          usersLoading,
          products,
          categories,
          productsLoading,
          onUpdateStatus: handleUpdateStatus,
          onPrintReceipt: handlePrintReceipt,
          onViewOrderDetail: handleViewOrderDetail,
          onUpdateSiteContent: handleUpdateSiteContent,
          onRefreshUsers: handleRefreshUsers,
          onEditUser: handleEditUser,
          onDeleteUser: handleDeleteUser,
          onResetPasswordUser: handleResetPasswordUser,
          onCreateUser: handleCreateUser,
          onRefreshProducts: handleRefreshProducts,
          onEditProduct: handleEditProduct,
          onDeleteProduct: handleDeleteProduct,
          onToggleProductActive: handleToggleProductActive,
          onCreateProduct: handleCreateProduct,
        })}
      </main>

      {/* Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
        onSubmit={handleUserSubmit}
        loading={modalLoading}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        userName={selectedUser?.name || ''}
        onSubmit={handleResetPasswordSubmit}
        loading={modalLoading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userName={users.find(u => u.id === userToDelete)?.name || ''}
        onConfirm={handleDeleteConfirm}
        loading={modalLoading}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleProductSubmit}
        loading={modalLoading}
      />

      <OrderDetailModal
        isOpen={isOrderDetailOpen}
        onClose={() => setIsOrderDetailOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onPrintReceipt={handlePrintReceipt}
      />
    </div>
  );
}
