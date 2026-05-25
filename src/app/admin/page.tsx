'use client';

import React from 'react';
import Image from 'next/image';
import {
  Home,
  Grid3x3,
  Box,
  LogIn,
  FileText,
  Mail,
  LayoutDashboard,
  Search,
  Bell,
  Settings,
  Maximize2,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ShoppingCart,
  DollarSign,
  Percent,
  Package,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ==================== HEADER ====================
const Header = () => {
  return (
    <header className="h-18 bg-amber-50 border-b-4 border-amber-700 px-32.5 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo getuk_20260505_231853_0000(1).png"
          alt="Getuk Gondok Logo"
          width={60}
          height={60}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <div className="text-2xl font-bold text-amber-900">Getuk Gondok</div>
          <div className="text-xs text-amber-600 font-semibold">Hj. Sri Rahayu</div>
        </div>
      </div>

      {/* Right Side - Icons & Search */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Search Box */}
        <div className="bg-[#414456] rounded-full px-4 py-2.5 flex items-center gap-2 w-64">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-gray-300 placeholder-gray-500 outline-none flex-1 text-sm"
          />
        </div>

        {/* Notification */}
        <button className="relative text-gray-400 hover:text-gray-300">
          <Bell size={18} />
          <span className="absolute -top-2 -right-2 bg-[#ff4d63] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 bg-linear-to-br from-[#00b3a6] to-[#626fd6] rounded-full cursor-pointer"></div>

        {/* Settings */}
        <button className="text-gray-400 hover:text-gray-300">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};

// ==================== NAVIGATION BAR ====================
const NavBar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: false },
    { icon: Grid3x3, label: 'UI Elements', active: false },
    { icon: Box, label: 'Components', active: false },
    { icon: LogIn, label: 'Authentication', active: false },
    { icon: FileText, label: 'Extra Pages', active: false },
    { icon: Mail, label: 'Email Templates', active: false },
    { icon: LayoutDashboard, label: 'Layouts', active: true },
  ];

  return (
    <nav className="bg-amber-700 h-14 border-b border-amber-700 flex items-center px-32.5 gap-0">
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`flex items-center gap-2 px-6 py-3 text-sm border-b-2 transition-all ${
            item.active
              ? 'border-[#00b3a6] text-white'
              : 'border-transparent text-white hover:text-gray-300'
          }`}
        >
          <item.icon size={16} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ==================== STATISTIC CARD ====================
interface StatCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
  percentage: string;
  trendColor: 'cyan' | 'red' | 'blue' | 'yellow';
  icon: React.ReactNode;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  percentage,
  trendColor,
  icon,
  description,
}) => {
  const bgColorMap = {
    cyan: '#00b3a6',
    red: '#ff4d63',
    blue: '#7dd3fc',
    yellow: '#f6b739',
  };

  const bgColor = bgColorMap[trendColor];

  return (
    <div className="bg-[#626fd6] rounded-md p-6 flex flex-col justify-between h-40 relative overflow-hidden">
      {/* Ribbon at top right */}
      <div
        className="absolute top-0 right-0 px-3 py-1 text-white text-xs font-medium"
        style={{
          backgroundColor: bgColor,
          clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
          paddingRight: '16px',
        }}
      >
        {trend === 'up' ? '+' : ''}{percentage}
      </div>

      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white/40">
        {icon}
      </div>

      {/* Title and trend */}
      <div>
        <p className="text-white/60 text-xs tracking-wide mb-2">{title}</p>
        <div className="flex items-end justify-between">
          <h3 className="text-white text-2xl font-semibold">{value}</h3>
          <div className="flex items-center gap-1">
            {trend === 'up' ? (
              <ArrowUp size={16} className="text-[#00b3a6]" />
            ) : (
              <ArrowDown size={16} className="text-[#ff4d63]" />
            )}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between">
        <p className="text-white/50 text-xs">{description}</p>
        <ChevronRight size={16} className="text-white/40" />
      </div>
    </div>
  );
};

// ==================== CIRCULAR PROGRESS ====================
interface CircularProgressProps {
  percentage: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="6"
      />
      {/* Progress circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#00b3a6"
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      {/* Center text */}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="16"
        fontWeight="bold"
        fill="#4b5563"
      >
        {percentage}%
      </text>
    </svg>
  );
};

// ==================== MONTHLY EARNING CARD ====================
const MonthlyEarningCard = () => {
  const data = [
    { x: 1, y: 5 },
    { x: 2, y: 9 },
    { x: 3, y: 7 },
    { x: 4, y: 8 },
    { x: 5, y: 5 },
    { x: 6, y: 3 },
    { x: 7, y: 5 },
    { x: 8, y: 4 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-gray-900 text-lg font-semibold mb-6">Monthly Earning</h3>

      <div className="flex gap-8">
        {/* Chart Area */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#626fd6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#626fd6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="x"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#9ca3af' }}
                domain={[0, 9]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
                cursor={{ stroke: '#e5e7eb' }}
              />
              <Area
                type="monotone"
                dataKey="y"
                stroke="#626fd6"
                strokeWidth={2}
                fill="url(#colorArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right Info */}
        <div className="flex flex-col justify-center gap-8 w-48">
          {/* This Month */}
          <div>
            <p className="text-gray-500 text-sm mb-1">This month</p>
            <h4 className="text-gray-900 text-2xl font-semibold mb-2">$34,252</h4>
            <p className="text-gray-400 text-xs mb-4">
              It will be as simple as in fact it will be occidental.
            </p>
            <div className="flex justify-center">
              <CircularProgress percentage={75} />
            </div>
          </div>

          {/* Last Month */}
          <div>
            <p className="text-gray-500 text-sm mb-1">Last month</p>
            <h4 className="text-gray-900 text-2xl font-semibold mb-2">$36,253</h4>
            <p className="text-gray-400 text-xs mb-4">
              It will be as simple as in fact it will be occidental.
            </p>
            <div className="flex justify-center">
              <CircularProgress percentage={65} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== SPARKLINE CHART ====================
interface SparklineProps {
  data: number[];
}

const Sparkline: React.FC<SparklineProps> = ({ data }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 60;
  const padding = 4;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = height - ((value - min) / range) * (height - 2 * padding) - padding;
    return `${x},${y}`;
  });

  return (
    <svg width="100" height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="#00b3a6"
        strokeWidth="1.5"
      />
    </svg>
  );
};

// ==================== SALES ANALYTICS CARD ====================
const SalesAnalyticsCard = () => {
  const sections = [
    {
      label: 'Online',
      value: '1,542',
      sparklineData: [10, 15, 12, 18, 14, 16, 20, 17],
    },
    {
      label: 'Offline',
      value: '6,451',
      sparklineData: [8, 12, 10, 16, 13, 18, 15, 19],
    },
    {
      label: 'Marketing',
      value: '84,574',
      sparklineData: [5, 8, 6, 12, 9, 14, 11, 16],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-gray-900 text-lg font-semibold mb-6">Sales Analytics</h3>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-500 text-sm">{section.label}</p>
                <p className="text-gray-900 text-lg font-semibold">{section.value}</p>
              </div>
              <Sparkline data={section.sparklineData} />
            </div>
            {index < sections.length - 1 && <div className="border-t border-[#e5e7eb]"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== MAIN DASHBOARD ====================
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-amber-950">
      {/* Header */}
      <Header />

      {/* Navigation */}
      <NavBar />

      {/* Main Content */}
      <main className="px-32.5 py-6 space-y-7">
        {/* Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<ShoppingCart size={20} />}
            title="ORDERS"
            value="1,685"
            trend="up"
            percentage="12%"
            trendColor="cyan"
            description="Since last month"
          />
          <StatCard
            icon={<DollarSign size={20} />}
            title="REVENUE"
            value="52,368"
            trend="down"
            percentage="28%"
            trendColor="red"
            description="Since last month"
          />
          <StatCard
            icon={<Percent size={20} />}
            title="AVERAGE PRICE"
            value="15.8"
            trend="up"
            percentage="00%"
            trendColor="blue"
            description="Since last month"
          />
          <StatCard
            icon={<Package size={20} />}
            title="PRODUCT SOLD"
            value="2436"
            trend="up"
            percentage="84%"
            trendColor="yellow"
            description="Since last month"
          />
        </div>

        {/* Bottom Layout - 75/25 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Earning - 75% width */}
          <div className="lg:col-span-2">
            <MonthlyEarningCard />
          </div>

          {/* Sales Analytics - 25% width */}
          <div>
            <SalesAnalyticsCard />
          </div>
        </div>
      </main>
    </div>
  );
}
