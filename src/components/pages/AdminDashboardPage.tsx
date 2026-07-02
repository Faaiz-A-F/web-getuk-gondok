"use client";

import React, { useState, useEffect } from "react";
import { HeaderLandingPage } from "@/components/layout/HeaderLandingPage";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
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
      <div className="flex items-center justify-center h-64">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
        <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">Monthly Earning</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.revenueByMonth}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#626fd6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#626fd6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
              <Area type="monotone" dataKey="revenue" stroke="#626fd6" strokeWidth={2} fill="url(#colorArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">Recent Orders</h3>
          <div className="space-y-4">
            {data.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <span className="font-medium text-gray-800">{order.orderNumber}</span>
                  <p className="text-xs text-gray-500">{order.userName}</p>
                </div>
                <span className="font-semibold text-amber-700">{formatCurrency(order.totalAmount)}</span>
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
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'DELIVERED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Daftar Pesanan</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{order.user.name}</div>
                  <div className="text-xs text-gray-400">{order.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(order.totalAmount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(order.id, 'PROCESSING')}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          title="Process Order"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          title="Cancel Order"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    {order.status === 'PROCESSING' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                        title="Mark as Done"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onPrintReceipt(order)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
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
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No orders found
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

  // Calculate statistics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'PAID' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  // Group by month
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm text-gray-500 mb-2">Total Revenue</h4>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm text-gray-500 mb-2">Total Orders</h4>
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm text-gray-500 mb-2">Completed</h4>
          <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm text-gray-500 mb-2">Pending</h4>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Month</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(ordersByMonth).map(([month, data]) => (
                <tr key={month}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{formatCurrency(data.revenue)}</td>
                </tr>
              ))}
              {Object.keys(ordersByMonth).length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No financial data available
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
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading site content...</p>
      </div>
    );
  }

  const highlightProducts = siteContent['highlight'] || [];
  const heroSection = siteContent['hero'] || [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Highlight Products</h3>
        <p className="text-sm text-gray-500 mb-4">Configure which products appear as highlights on the landing page.</p>
        {highlightProducts.length > 0 ? (
          <div className="space-y-4">
            {highlightProducts.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">{item.label}</label>
                  <input
                    type="text"
                    defaultValue={item.value}
                    onBlur={(e) => onUpdate(item.key, e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Product ID or slug"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No highlight products configured yet.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
        {heroSection.length > 0 ? (
          <div className="space-y-4">
            {heroSection.map((item) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                <label className="text-sm font-medium text-gray-700">{item.label}</label>
                <textarea
                  defaultValue={item.value}
                  onBlur={(e) => onUpdate(item.key, e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hero section content configured yet.</p>
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
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Daftar User</h3>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
        >
          <Plus size={16} />
          <span>Tambah User</span>
        </button>
      </div>

      <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Daftar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        {user.isMainAdmin && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-700">
                            <Shield size={12} />
                            Main Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.orderCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {!user.isMainAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onResetPassword(user.id)}
                            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"
                            title="Reset Password"
                          >
                            <Key size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            title="Hapus User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                      {user.isMainAdmin && (
                        <span className="text-xs text-gray-400">Protected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No users found
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
      <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl w-full max-w-md shadow-2xl border border-amber-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-4">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
    <nav className="flex h-14 items-center gap-0 border-b border-amber-700 bg-amber-700 px-8 lg:px-32.5">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm transition-all ${
            activeTab === item.id ? "border-[#00b3a6] text-white" : "border-transparent text-white hover:text-gray-300"
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
  <div className="relative flex h-40 flex-col justify-between overflow-hidden rounded-md bg-[#626fd6] p-6">
    <div
      className="absolute right-0 top-0 px-3 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: color, clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)", paddingRight: "16px" }}
    >
      {trend === "up" ? "+" : ""}{percentage}
    </div>
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white/40">{icon}</div>
    <div>
      <p className="mb-2 text-xs tracking-wide text-white/60">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-semibold text-white">{value}</h3>
        {trend === "up" ? <ArrowUp size={16} className="text-[#00b3a6]" /> : <ArrowDown size={16} className="text-[#ff4d63]" />}
      </div>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-xs text-white/50">Since last month</p>
      <ChevronRight size={16} className="text-white/40" />
    </div>
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
