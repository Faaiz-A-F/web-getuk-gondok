"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  ChevronRight,
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
  <header className="sticky top-0 z-50 flex h-20 items-center justify-between bg-white/80 backdrop-blur-md px-8 shadow-sm border-b border-amber-100 lg:px-32.5">
    <div className="flex items-center gap-4 cursor-pointer">
      <div className="bg-transparent p-1 rounded-xl">
        <Image
          src="/logo/13.png"
          alt="Getuk Gondok Logo"
          width={64}
          height={64}
          className="w-16 h-16 object-contain"
        />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">Getuk Gondok</h1>
        <p className="text-xs text-amber-600 font-medium tracking-wide uppercase">Hj. Sri Rahayu</p>
      </div>
    </div>

    <div className="ml-auto flex items-center gap-6">
      <div className="flex w-64 items-center gap-2 rounded-full bg-[#414456] px-4 py-2.5">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm text-gray-300 outline-none placeholder-gray-500"
        />
      </div>
      <button className="relative text-gray-400 hover:text-gray-300">
        <Bell size={18} />
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4d63] text-xs font-bold text-white">
          3
        </span>
      </button>
      <div className="h-9 w-9 cursor-pointer rounded-full bg-gradient-to-br from-[#00b3a6] to-[#626fd6] flex items-center justify-center text-white font-semibold">
        {user?.name?.charAt(0).toUpperCase() || 'A'}
      </div>
      <button className="text-gray-400 hover:text-gray-300">
        <Settings size={18} />
      </button>
    </div>
  </header>
);

type TabType = "dashboard" | "orders" | "financial" | "layout";

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

const NavBar = ({ activeTab, onTabChange }: { activeTab: TabType; onTabChange: (tab: TabType) => void }) => {
  const menuItems: { id: TabType; icon: React.ElementType; label: string }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "orders", icon: Receipt, label: "Pesanan" },
    { id: "financial", icon: FileBarChart, label: "Laporan Keuangan" },
    { id: "layout", icon: LayoutDashboard, label: "Layout" },
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
          setOrders(data.orders || []);
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

  return (
    <div className="min-h-screen bg-amber-50">
      <Header user={user} />
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="space-y-7 px-8 py-6 lg:px-32.5">
        {getContentByTab(activeTab, {
          dashboardData,
          orders,
          siteContent,
          loading,
          onUpdateStatus: handleUpdateStatus,
          onPrintReceipt: handlePrintReceipt,
          onUpdateSiteContent: handleUpdateSiteContent,
        })}
      </main>
    </div>
  );
}
