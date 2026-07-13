"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import MagelangImage from "../../assets/images/magelang fiks.png";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { User, MapPin, Mail, Phone, Calendar, Shield, CreditCard, Bell, Settings, ChevronRight, Clock, Package } from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    name: string;
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

export function AccountPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "password">("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    country: "",
    city: "",
    postal: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/user/settings?userId=${user.id}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((data) => setSettings(data))
      .catch((e) => {
        console.error("Error fetching settings:", e);
        setSettings({ settings: {} });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const save = async (payload: any) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, settings: payload }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error("Error saving settings:", e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders" && user) {
      setOrdersLoading(true);
      fetch(`/api/orders?userId=${user.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.orders) {
            setOrders(data.orders);
          } else if (Array.isArray(data)) {
            setOrders(data);
          } else {
            setOrders([]);
          }
        })
        .catch((e) => {
          console.error("Error fetching orders:", e);
          setOrders([]);
        })
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, user]);

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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "PAID":
        return "bg-blue-100 text-blue-700";
      case "DONE":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Fallback defaults if auth context or api isn't ready
  const display = {
    name: user?.name ?? "Natashia Khaleira",
    role: user?.role ?? "Admin",
    location: settings?.settings?.location ?? "Leeds, United Kingdom",
    email: user?.email ?? "info@binary-fusion.com",
    phone: settings?.settings?.phone ?? "(+62) 821 2554-5846",
    dob: settings?.settings?.dob ?? "12-10-1990",
    postal: settings?.settings?.postal ?? "ERT 1254",
    city: settings?.settings?.city ?? "Leeds, East London",
    country: settings?.settings?.country ?? "United Kingdom",
  };

  const navItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders", label: "Order History", icon: Package },
    { id: "password", label: "Change Password", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#F8E8BD] relative">
      {/* Background Image */}
      <div className="hidden lg:block fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src={MagelangImage}
          alt="Magelang"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header Component */}
          <Header />

          {/* Content Area */}
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex gap-6">
                {/* Profile Sidebar */}
                <div className="w-80 flex-shrink-0 hidden xl:block">
                  <div className="bg-[#F7F7F5] rounded-2xl shadow-xl p-6 sticky top-24 border border-[#E8D4C4]">
                    {/* User Card */}
                    <div className="text-center pb-6 border-b border-[#E8D4C4]">
                      <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#D29A2A] to-[#C87536] mx-auto flex items-center justify-center">
                          <span className="text-white text-3xl font-bold">{display.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <h3 className="mt-4 font-bold text-[#4A1D0B] text-lg">{display.name}</h3>
                      <p className="text-sm text-[#8B6F47]">{display.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-[#D29A2A] to-[#C87536] text-white text-xs font-semibold rounded-full">
                        {display.role}
                      </span>
                    </div>

                    {/* Menu */}
                    <div className="pt-4 space-y-1">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-[#D29A2A] to-[#C87536] text-white shadow-lg"
                                : "text-[#4A1D0B] hover:bg-[#F8E8BD]"
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#C87536]"}`} />
                            {item.label}
                            <ChevronRight className={`w-4 h-4 ml-auto ${isActive ? "text-white" : "text-[#C87536]"}`} />
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Back to Dashboard Button */}
                    <div className="pt-4 mt-4 border-t border-[#E8D4C4]">
                      <a href="/" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#D29A2A] to-[#C87536] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Dashboard
                      </a>
                    </div>
                  </div>
                </div>

                {/* Main Profile Content */}
                <div className="flex-1 space-y-6">
                  {activeTab === "profile" && (
                    <>
                      {/* Profile Header Card */}
                      <div className="bg-gradient-to-r from-[#4A1D0B] to-[#6B3A1D] rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#D29A2A] to-[#C87536] flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">{display.name?.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold">{display.name}</h2>
                            <p className="text-[#D29A2A]">{display.role}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-[#F8E8BD]">
                              <MapPin className="w-4 h-4" />
                              {display.location}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {}}
                              className="px-5 py-2.5 bg-[#F8E8BD] text-[#4A1D0B] font-semibold rounded-xl hover:bg-[#E8D4C4] transition-colors shadow-lg"
                            >
                              Edit Profile
                            </button>
                            <button
                              disabled={loading}
                              onClick={() =>
                                save({
                                  location: display.location,
                                  phone: display.phone,
                                  dob: display.dob,
                                  postal: display.postal,
                                  city: display.city,
                                  country: display.country,
                                })
                              }
                              className="px-5 py-2.5 bg-[#C87536] text-white font-semibold rounded-xl hover:bg-[#A85E2E] transition-colors disabled:opacity-50 shadow-lg"
                            >
                              {loading ? "Saving..." : "Save Changes"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Personal Information Card */}
                      <div className="bg-[#F7F7F5] rounded-2xl shadow-lg overflow-hidden border border-[#E8D4C4]">
                        <div className="px-6 py-5 border-b border-[#E8D4C4] bg-gradient-to-r from-[#F8E8BD] to-transparent">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D29A2A] to-[#C87536] flex items-center justify-center shadow-md">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-[#4A1D0B]">Personal Information</h3>
                              <p className="text-sm text-[#8B6F47]">Detail informasi pribadi Anda</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* First Name */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">First Name</label>
                              <div className="px-4 py-3 bg-[#F8E8BD] rounded-xl text-[#4A1D0B] font-medium border border-[#E8D4C4]">
                                {(display.name || "").split(" ")[0]}
                              </div>
                            </div>
                            {/* Last Name */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Last Name</label>
                              <div className="px-4 py-3 bg-[#F8E8BD] rounded-xl text-[#4A1D0B] font-medium border border-[#E8D4C4]">
                                {(display.name || "").split(" ").slice(1).join(" ")}
                              </div>
                            </div>
                            {/* Date of Birth */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Date of Birth</label>
                              <div className="px-4 py-3 bg-[#F8E8BD] rounded-xl text-[#4A1D0B] font-medium flex items-center gap-2 border border-[#E8D4C4]">
                                <Calendar className="w-4 h-4 text-[#C87536]" />
                                {display.dob}
                              </div>
                            </div>
                            {/* Email */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Email Address</label>
                              <div className="px-4 py-3 bg-[#F8E8BD] rounded-xl text-[#4A1D0B] font-medium flex items-center gap-2 border border-[#E8D4C4]">
                                <Mail className="w-4 h-4 text-[#C87536]" />
                                {display.email}
                              </div>
                            </div>
                            {/* Phone */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Phone Number</label>
                              <div className="px-4 py-3 bg-[#F8E8BD] rounded-xl text-[#4A1D0B] font-medium flex items-center gap-2 border border-[#E8D4C4]">
                                <Phone className="w-4 h-4 text-[#C87536]" />
                                {display.phone}
                              </div>
                            </div>
                            {/* User Role */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">User Role</label>
                              <div className="px-4 py-3 bg-[#F8E8BD] rounded-xl text-[#4A1D0B] font-medium flex items-center gap-2 border border-[#E8D4C4]">
                                <Shield className="w-4 h-4 text-[#C87536]" />
                                {display.role}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Address Card */}
                      <div className="bg-[#F7F7F5] rounded-2xl shadow-lg overflow-hidden border border-[#E8D4C4]">
                        <div className="px-6 py-5 border-b border-[#E8D4C4] bg-gradient-to-r from-[#F8E8BD] to-transparent">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#388E3C] flex items-center justify-center shadow-md">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-[#4A1D0B]">Address</h3>
                              <p className="text-sm text-[#8B6F47]">Alamat pengiriman Anda</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Country */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Country</label>
                              <div className="px-4 py-3 bg-[#F8E8BD] rounded-xl text-[#4A1D0B] font-medium border border-[#E8D4C4]">
                                {display.country}
                              </div>
                            </div>
                            {/* City */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">City</label>
                              <div className="px-4 py-3 bg-[#F8E8BD] rounded-xl text-[#4A1D0B] font-medium border border-[#E8D4C4]">
                                {display.city}
                              </div>
                            </div>
                            {/* Postal Code */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Postal Code</label>
                              <div className="px-4 py-3 bg-[#F8E8BD] rounded-xl text-[#4A1D0B] font-medium border border-[#E8D4C4]">
                                {display.postal}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#F7F7F5] rounded-2xl p-5 shadow-lg border border-[#E8D4C4]">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1565C0] to-[#1976D2] flex items-center justify-center shadow-md">
                              <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-[#8B6F47]">Total Orders</p>
                              <p className="text-2xl font-bold text-[#4A1D0B]">{orders.length}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#F7F7F5] rounded-2xl p-5 shadow-lg border border-[#E8D4C4]">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#388E3C] flex items-center justify-center shadow-md">
                              <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-[#8B6F47]">Saved Addresses</p>
                              <p className="text-2xl font-bold text-[#4A1D0B]">3</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#F7F7F5] rounded-2xl p-5 shadow-lg border border-[#E8D4C4]">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B1FA2] to-[#9C27B0] flex items-center justify-center shadow-md">
                              <Bell className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-[#8B6F47]">Notifications</p>
                              <p className="text-2xl font-bold text-[#4A1D0B]">12</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "orders" && (
                    <>
                      {/* Order History Header */}
                      <div className="bg-[#F7F7F5] rounded-2xl shadow-lg overflow-hidden border border-[#E8D4C4]">
                        <div className="px-6 py-5 border-b border-[#E8D4C4] bg-gradient-to-r from-[#F8E8BD] to-transparent">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D29A2A] to-[#C87536] flex items-center justify-center shadow-md">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-[#4A1D0B]">Order History</h3>
                              <p className="text-sm text-[#8B6F47]">Riwayat pesanan Anda</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          {ordersLoading ? (
                            <div className="flex items-center justify-center py-12">
                              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#F8E8BD] border-t-[#C87536]"></div>
                            </div>
                          ) : orders.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-[#F8E8BD] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8D4C4]">
                                <Package className="w-8 h-8 text-[#C87536]" />
                              </div>
                              <h3 className="text-lg font-semibold text-[#4A1D0B] mb-2">Belum ada pesanan</h3>
                              <p className="text-sm text-[#8B6F47] mb-4">Anda belum memiliki riwayat pesanan.</p>
                              <a href="/catalogue" className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#D29A2A] to-[#C87536] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md">
                                Mulai Belanja
                              </a>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-[#E8D4C4]">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Order ID</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Tanggal</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Items</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Total</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Pembayaran</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-[#E8D4C4] hover:bg-[#F8E8BD] transition-colors">
                                      <td className="py-4 px-4">
                                        <span className="font-mono text-sm font-medium text-[#C87536]">{order.orderNumber}</span>
                                      </td>
                                      <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-sm text-[#4A1D0B]">
                                          <Clock className="w-4 h-4 text-[#C87536]" />
                                          {formatDate(order.createdAt)}
                                        </div>
                                      </td>
                                      <td className="py-4 px-4">
                                        <div className="text-sm text-[#4A1D0B]">
                                          {order.items && order.items.length > 0 ? (
                                            <span>{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                                          ) : (
                                            <span>-</span>
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-4 px-4">
                                        <span className="font-semibold text-[#C87536]">{formatPrice(Number(order.totalAmount))}</span>
                                      </td>
                                      <td className="py-4 px-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                          {order.status}
                                        </span>
                                      </td>
                                      <td className="py-4 px-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                          order.paymentStatus === "PAID" 
                                            ? "bg-green-100 text-green-700" 
                                            : order.paymentStatus === "UNPAID"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}>
                                          {order.paymentStatus}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "password" && (
                    <>
                      {/* Change Password Card */}
                      <div className="bg-[#F7F7F5] rounded-2xl shadow-lg overflow-hidden border border-[#E8D4C4]">
                        <div className="px-6 py-5 border-b border-[#E8D4C4] bg-gradient-to-r from-[#F8E8BD] to-transparent">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D29A2A] to-[#C87536] flex items-center justify-center shadow-md">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-[#4A1D0B]">Change Password</h3>
                              <p className="text-sm text-[#8B6F47]">Ubah kata sandi akun Anda</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          {passwordSuccess && (
                            <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl">
                              {passwordSuccess}
                            </div>
                          )}
                          {passwordError && (
                            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl">
                              {passwordError}
                            </div>
                          )}
                          <form className="space-y-4 max-w-md">
                            <div>
                              <label className="block text-xs font-semibold text-[#8B6F47] uppercase tracking-wider mb-2">Current Password</label>
                              <input
                                type="password"
                                placeholder="Masukkan password saat ini"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-[#E8D4C4] rounded-xl text-[#4A1D0B] focus:outline-none focus:ring-2 focus:ring-[#C87536] focus:border-[#C87536] bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#8B6F47] uppercase tracking-wider mb-2">New Password</label>
                              <input
                                type="password"
                                placeholder="Masukkan password baru"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-[#E8D4C4] rounded-xl text-[#4A1D0B] focus:outline-none focus:ring-2 focus:ring-[#C87536] focus:border-[#C87536] bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#8B6F47] uppercase tracking-wider mb-2">Confirm New Password</label>
                              <input
                                type="password"
                                placeholder="Konfirmasi password baru"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-[#E8D4C4] rounded-xl text-[#4A1D0B] focus:outline-none focus:ring-2 focus:ring-[#C87536] focus:border-[#C87536] bg-white"
                              />
                            </div>
                            <button
                              type="button"
                              disabled={passwordLoading || !user}
                              onClick={async () => {
                                if (!user) return;
                                setPasswordError("");
                                setPasswordSuccess("");
                                
                                if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                                  setPasswordError("Password baru dan konfirmasi password tidak cocok");
                                  return;
                                }
                                
                                if (passwordForm.newPassword.length < 6) {
                                  setPasswordError("Password minimal 6 karakter");
                                  return;
                                }
                                
                                setPasswordLoading(true);
                                try {
                                  const res = await fetch("/api/user/change-password", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      userId: user.id,
                                      currentPassword: passwordForm.currentPassword,
                                      newPassword: passwordForm.newPassword,
                                    }),
                                  });
                                  
                                  const data = await res.json();
                                  
                                  if (!res.ok) {
                                    setPasswordError(data.error || "Gagal mengubah password");
                                  } else {
                                    setPasswordSuccess("Password berhasil diubah!");
                                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                  }
                                } catch (error) {
                                  setPasswordError("Terjadi kesalahan saat mengubah password");
                                } finally {
                                  setPasswordLoading(false);
                                }
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-[#D29A2A] to-[#C87536] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
                            >
                              {passwordLoading ? "Menyimpan..." : "Update Password"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
