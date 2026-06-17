"use client";

import Image from "next/image";
import React from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Box,
  ChevronRight,
  DollarSign,
  FileText,
  Grid3x3,
  Home,
  LayoutDashboard,
  LogIn,
  Mail,
  Package,
  Percent,
  Search,
  Settings,
  ShoppingCart,
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

const Header = () => (
  <header className="flex h-18 items-center justify-between border-b-4 border-amber-700 bg-amber-50 px-8 lg:px-32.5">
    <div className="flex items-center gap-3">
      <Image
        src="/logo/13.png"
        alt="Getuk Gondok Logo"
        width={100}
        height={100}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <div className="text-2xl font-bold text-amber-900">Getuk Gondok</div>
        <div className="text-xs font-semibold text-amber-600">Hj. Sri Rahayu</div>
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
      <div className="h-9 w-9 cursor-pointer rounded-full bg-linear-to-br from-[#00b3a6] to-[#626fd6]" />
      <button className="text-gray-400 hover:text-gray-300">
        <Settings size={18} />
      </button>
    </div>
  </header>
);

const NavBar = () => {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: false },
    { icon: Grid3x3, label: "UI Elements", active: false },
    { icon: Box, label: "Components", active: false },
    { icon: LogIn, label: "Authentication", active: false },
    { icon: FileText, label: "Extra Pages", active: false },
    { icon: Mail, label: "Email Templates", active: false },
    { icon: LayoutDashboard, label: "Layouts", active: true },
  ];

  return (
    <nav className="flex h-14 items-center gap-0 border-b border-amber-700 bg-amber-700 px-8 lg:px-32.5">
      {menuItems.map((item) => (
        <button
          key={item.label}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm transition-all ${
            item.active ? "border-[#00b3a6] text-white" : "border-transparent text-white hover:text-gray-300"
          }`}
        >
          <item.icon size={16} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
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

const chartData = [
  { x: 1, y: 5 },
  { x: 2, y: 9 },
  { x: 3, y: 7 },
  { x: 4, y: 8 },
  { x: 5, y: 5 },
  { x: 6, y: 3 },
  { x: 7, y: 5 },
  { x: 8, y: 4 },
];

export function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-amber-950">
      <Header />
      <NavBar />

      <main className="space-y-7 px-8 py-6 lg:px-32.5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<ShoppingCart size={20} />} title="ORDERS" value="1,685" trend="up" percentage="12%" color="#00b3a6" />
          <StatCard icon={<DollarSign size={20} />} title="REVENUE" value="52,368" trend="down" percentage="28%" color="#ff4d63" />
          <StatCard icon={<Percent size={20} />} title="AVERAGE PRICE" value="15.8" trend="up" percentage="00%" color="#7dd3fc" />
          <StatCard icon={<Package size={20} />} title="PRODUCT SOLD" value="2436" trend="up" percentage="84%" color="#f6b739" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Monthly Earning</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#626fd6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#626fd6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="x" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} domain={[0, 9]} />
                <Tooltip />
                <Area type="monotone" dataKey="y" stroke="#626fd6" strokeWidth={2} fill="url(#colorArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Sales Analytics</h3>
            <div className="space-y-4 text-sm text-neutral-700">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span>Online</span>
                <span className="font-semibold text-amber-700">1,542</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span>Offline</span>
                <span className="font-semibold text-amber-700">6,451</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Marketing</span>
                <span className="font-semibold text-amber-700">84,574</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
