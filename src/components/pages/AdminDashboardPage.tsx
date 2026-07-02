"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  FileBarChart,
  LayoutDashboard,
  Package,
  Percent,
  Printer,
  Receipt,
  Search,
  Settings,
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

const Header = ({ user }: { user: { name: string } | null }) => (
  <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-amber-200/60 bg-gradient-to-r from-white via-white to-amber-50/50 px-4 shadow-[0_8px_30px_rgba(120,53,15,0.08)] backdrop-blur-md lg:px-32.5">
    <div className="flex items-center gap-4 cursor-pointer group">
      <div className="relative rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 p-1.5 shadow-md ring-2 ring-amber-200/50 group-hover:ring-amber-300 transition-all duration-300 group-hover:scale-105">
        <Image
          src="/logo/13.png"
          alt="Getuk Gondok Logo"
          width={64}
          height={64}
          className="h-14 w-14 object-contain"
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
      </div>
      <div className="transition-all duration-300 group-hover:translate-x-1">
        <h1 className="text-xl font-black tracking-tight text-amber-950 sm:text-2xl">Getuk Gondok</h1>
        <p className="text-xs font-medium uppercase tracking-wide text-amber-600">Hj. Sri Rahayu</p>
      </div>
    </div>

    <div className="ml-auto flex items-center gap-3 sm:gap-5">
      <div className="group relative flex items-center gap-2 rounded-2xl border-2 border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-white px-4 py-2.5 shadow-sm transition-all duration-300 hover:border-amber-300 hover:shadow-md focus-within:border-amber-400 focus-within:shadow-lg sm:w-64">
        <Search size={18} className="text-amber-500 transition-colors group-focus-within:text-amber-600" />
        <input
          type="text"
          placeholder="Cari sesuatu..."
          className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <button className="relative rounded-xl p-2.5 text-amber-600 transition-all duration-300 hover:bg-amber-100 hover:text-amber-700 hover:scale-110 active:scale-95">
        <Bell size={20} />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-[10px] font-bold text-white shadow-lg animate-bounce">
          3
        </span>
      </button>
      <div className="group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-[#00b3a6] to-[#00a69a] font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
        {user?.name?.charAt(0).toUpperCase() || 'A'}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
          {user?.name || 'Admin'}
        </div>
      </div>
      <button className="rounded-xl p-2.5 text-amber-600 transition-all duration-300 hover:bg-amber-100 hover:text-amber-700 hover:scale-110 active:scale-95">
        <Settings size={20} />
      </button>
    </div>
  </header>
);

type TabType = "dashboard" | "orders" | "financial" | "layout" | "users";

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
  user: { name: string; email: string };
  items: Array<{ quantity: number; price: number; product: { name: string } }>;
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
          color="#00b3a6" 
        />
        <StatCard 
          icon={<ShoppingCart size={20} />} 
          title="RUMAH PRODUKSI (Hari Ini)" 
          value={data.houseOrders.toString()} 
          trend="up" 
          percentage="0%" 
          color="#00b3a6" 
        />
        <StatCard 
          icon={<DollarSign size={20} />} 
          title="PENDAPATAN (Hari Ini)" 
          value={formatCurrency(data.totalRevenue)} 
          trend="up" 
          percentage="0%" 
          color="#ff4d63" 
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
                  <stop offset="5%" stopColor="#626fd6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#626fd6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorAreaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#626fd6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#626fd6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip 
                formatter={(value: any) => formatCurrency(Number(value))}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '12px', 
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#626fd6" strokeWidth={3} fill="url(#colorArea)" />
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

const OrdersContent = ({ orders, loading, onUpdateStatus, onPrintReceipt }: { 
  orders: Order[]; 
  loading: boolean;
  onUpdateStatus: (id: string, status: string) => void;
  onPrintReceipt: (order: Order) => void;
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'PAID': return 'bg-emerald-100 text-emerald-800';
      case 'DELIVERED': return 'bg-violet-100 text-violet-800';
      case 'CANCELLED': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
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
          <span className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-700">
            <Receipt size={14} />
            {orders.length} Pesanan
          </span>
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
            {orders.map((order, index) => (
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
                    {order.status === 'PROCESSING' && <Activity size={12} />}
                    {order.status === 'DELIVERED' && <Check size={12} />}
                    {order.status === 'CANCELLED' && <X size={12} />}
                    {order.status === 'PAID' && <DollarSign size={12} />}
                    {order.status}
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
                  <div className="flex items-center gap-1.5">
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(order.id, 'PROCESSING')}
                          className="group/btn rounded-xl p-2 text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:scale-110 hover:shadow-lg"
                          title="Process Order"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                          className="group/btn rounded-xl p-2 text-rose-600 transition-all duration-300 hover:bg-rose-50 hover:scale-110 hover:shadow-lg"
                          title="Cancel Order"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    {order.status === 'PROCESSING' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                        className="group/btn rounded-xl p-2 text-emerald-600 transition-all duration-300 hover:bg-emerald-50 hover:scale-110 hover:shadow-lg"
                        title="Mark as Done"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onPrintReceipt(order)}
                      className="group/btn rounded-xl p-2 text-amber-600 transition-all duration-300 hover:bg-amber-50 hover:scale-110 hover:shadow-lg"
                      title="Print Receipt"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
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
    .filter(o => o.paymentStatus === 'PAID' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  const ordersByMonth = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { count: 0, revenue: 0 };
    }
    acc[month].count += 1;
    if (order.paymentStatus === 'PAID' || order.status === 'DELIVERED') {
      acc[month].revenue += Number(order.totalAmount);
    }
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/30 p-5 shadow-md transition-all duration-500 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-100/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">Total Revenue</p>
              <p className="mt-2 text-xl font-bold text-slate-800">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-inner">
              <DollarSign size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <TrendingUp size={14} />
            <span>Semua waktu</span>
          </div>
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
            <thead className="bg-gradient-to-r from-amber-50 to-amber-100/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Bulan</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Jumlah Pesanan</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-800">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/50">
              {Object.entries(ordersByMonth).map(([month, data]) => (
                <tr key={month} className="group/row transition-all duration-300 hover:bg-amber-50/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-700 font-bold text-sm shadow-inner">
                        {month.slice(0, 3)}
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{month}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      <Receipt size={12} />
                      {data.count} Pesanan
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">{formatCurrency(data.revenue)}</td>
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
              className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white resize-none text-black placeholder-gray-400"
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
    { id: "orders", icon: Receipt, label: "Pesanan" },
    { id: "financial", icon: FileBarChart, label: "Laporan Keuangan" },
    { id: "layout", icon: LayoutDashboard, label: "Layout" },
    { id: "users", icon: Users, label: "User Management" },
  ];

  return (
    <nav className="relative overflow-hidden border-b border-amber-800/50 bg-gradient-to-r from-[#8b4a12] via-[#a0522d] to-[#8b4a12] px-4 shadow-lg lg:px-32.5">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
      </div>
      
      <div className="relative flex h-14 items-center gap-2 overflow-x-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`group relative flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeTab === item.id
                ? "bg-white/95 text-amber-900 shadow-lg shadow-black/10 scale-105"
                : "text-white/90 hover:bg-white/10 hover:text-white hover:scale-102"
            }`}
          >
            {activeTab === item.id && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-200/50 to-amber-100/30 -z-10"></div>
            )}
            <item.icon size={18} className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} ${activeTab === item.id ? 'text-amber-700' : ''}`} />
            <span className="whitespace-nowrap">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute -bottom-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-amber-600"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

const getContentByTab = (tab: TabType, props: any) => {
  switch (tab) {
    case "dashboard":
      return <DashboardContent data={props.dashboardData} />;
    case "orders":
      return <OrdersContent orders={props.orders} loading={props.loading} onUpdateStatus={props.onUpdateStatus} onPrintReceipt={props.onPrintReceipt} />;
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
  <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white to-amber-50/30 p-6 shadow-lg transition-all duration-500 hover:shadow-xl hover:border-amber-300 hover:-translate-y-1">
    {/* Decorative background elements */}
    <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-amber-100/40 opacity-0 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12"></div>
    <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-amber-100/30 blur-xl"></div>
    
    {/* Trend badge */}
    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-105"
      style={{ backgroundColor: `${color}20`, color: color }}>
      {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      <span>{trend === "up" ? "+" : ""}{percentage}</span>
    </div>
    
    {/* Icon */}
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-inner transition-all duration-300 group-hover:scale-110"
      style={{ backgroundColor: `${color}15`, color: color }}>
      {icon}
    </div>
    
    {/* Content */}
    <div className="relative z-10">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {trend === "up" ? (
          <div className="flex items-center gap-1 rounded-full px-2 py-1" style={{ backgroundColor: `${color}15` }}>
            <TrendingUp size={14} style={{ color: color }} />
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full px-2 py-1" style={{ backgroundColor: `${color}15` }}>
            <TrendingDown size={14} style={{ color: color }} />
          </div>
        )}
      </div>
    </div>
    
    {/* Bottom decoration */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"></div>
  </div>
);

export function AdminDashboardPage() {
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
    // Create a printable receipt
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) return;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order.orderNumber}</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
            h1 { text-align: center; font-size: 18px; }
            .info { margin-bottom: 20px; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>GETUK GONDOK</h1>
          <p style="text-align:center">Hj. Sri Rahayu</p>
          <div class="info">
            <p><strong>Order:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString('id-ID')}</p>
            <p><strong>Customer:</strong> ${order.user.name}</p>
          </div>
          <hr>
          <div class="items">
            ${order.items.map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.product.name}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <div class="item">
              <span>TOTAL</span>
              <span>${formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
          <p style="text-align:center;margin-top:20px">Thank you!</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
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

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fff8ed_0%,_#fef3c7_45%,_#fdf7ed_100%)]">
      <Header user={user} />
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="space-y-7 px-8 py-6 lg:px-32.5">
        {getContentByTab(activeTab, {
          dashboardData,
          orders,
          siteContent,
          loading,
          users,
          usersLoading,
          onUpdateStatus: handleUpdateStatus,
          onPrintReceipt: handlePrintReceipt,
          onUpdateSiteContent: handleUpdateSiteContent,
          onRefreshUsers: handleRefreshUsers,
          onEditUser: handleEditUser,
          onDeleteUser: handleDeleteUser,
          onResetPasswordUser: handleResetPasswordUser,
          onCreateUser: handleCreateUser,
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
    </div>
  );
}
