"use client"
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, MapPin, Mail, Phone, Calendar, Shield, CreditCard, Key, Bell, Settings, ChevronRight } from "lucide-react";

export function AccountPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "balance" | "bank" | "password">("profile");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/user/settings?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch((e) => console.error("Error fetching settings:", e))
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
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error("Error saving settings:", e);
    } finally {
      setLoading(false);
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
    { id: "balance", label: "My Balance", icon: CreditCard },
    { id: "bank", label: "My Bank", icon: Shield },
    { id: "password", label: "Change Password", icon: Key },
  ];

  const sidebarItems = [
    { label: "Dashboard", href: "/" },
    { label: "Orders", href: "/orders" },
    { label: "E-commerce", href: "/ecommerce" },
    { label: "Transactions", href: "/transactions" },
    { label: "Reports", href: "/reports" },
    { label: "Vendor Management", href: "/vendor" },
    { label: "Promotions", href: "/promotions" },
    { label: "Riders Management", href: "/riders" },
    { label: "Pages", href: "/pages" },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about", hasSubmenu: true },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-neutral-200 hidden lg:flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <div>
            <h1 className="font-bold text-amber-950 text-lg">Getuk</h1>
            <p className="text-xs text-neutral-500">Gondok Marketplace</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                index === 10
                  ? "text-amber-700 bg-amber-50"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <span className={index === 10 ? "text-amber-600" : "text-neutral-400"}>{item.label}</span>
              {item.hasSubmenu && <ChevronRight className="w-4 h-4 ml-auto" />}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-amber-950">My Profile</h2>
            <p className="text-sm text-neutral-500">Manage your account settings</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64"
              />
            </div>
            {/* Notifications */}
            <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* Settings */}
            <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-6">
              {/* Profile Sidebar */}
              <div className="w-80 flex-shrink-0 hidden xl:block">
                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                  {/* User Card */}
                  <div className="text-center pb-6 border-b border-neutral-100">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-amber-100 mx-auto">
                        <img
                          src="/images/avatar-placeholder.png"
                          alt={display.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <h3 className="mt-4 font-bold text-amber-950 text-lg">{display.name}</h3>
                    <p className="text-sm text-neutral-500">{display.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
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
                              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                              : "text-neutral-600 hover:bg-neutral-50"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-neutral-400"}`} />
                          {item.label}
                          <ChevronRight className={`w-4 h-4 ml-auto ${isActive ? "text-white" : "text-neutral-300"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main Profile Content */}
              <div className="flex-1 space-y-6">
                {/* Profile Header Card */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 backdrop-blur">
                      <img
                        src="/images/avatar-placeholder.png"
                        alt={display.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{display.name}</h2>
                      <p className="text-amber-100">{display.role}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-amber-100">
                        <MapPin className="w-4 h-4" />
                        {display.location}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {}}
                        className="px-5 py-2.5 bg-white text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-colors shadow-lg"
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
                        className="px-5 py-2.5 bg-amber-700 text-white font-semibold rounded-xl hover:bg-amber-800 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Information Card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-950">Personal Information</h3>
                        <p className="text-sm text-neutral-500">Your personal details</p>
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors">
                      <span>Edit</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* First Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">First Name</label>
                        <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800 font-medium">
                          {(display.name || "").split(" ")[0]}
                        </div>
                      </div>
                      {/* Last Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Name</label>
                        <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800 font-medium">
                          {(display.name || "").split(" ").slice(1).join(" ")}
                        </div>
                      </div>
                      {/* Date of Birth */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date of Birth</label>
                        <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800 font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          {display.dob}
                        </div>
                      </div>
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email Address</label>
                        <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800 font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-neutral-400" />
                          {display.email}
                        </div>
                      </div>
                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Phone Number</label>
                        <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800 font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4 text-neutral-400" />
                          {display.phone}
                        </div>
                      </div>
                      {/* User Role */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">User Role</label>
                        <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800 font-medium flex items-center gap-2">
                          <Shield className="w-4 h-4 text-neutral-400" />
                          {display.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-950">Address</h3>
                        <p className="text-sm text-neutral-500">Your shipping addresses</p>
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors">
                      <span>Edit</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Country */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Country</label>
                        <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800 font-medium">
                          {display.country}
                        </div>
                      </div>
                      {/* City */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">City</label>
                        <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800 font-medium">
                          {display.city}
                        </div>
                      </div>
                      {/* Postal Code */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Postal Code</label>
                        <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800 font-medium">
                          {display.postal}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Total Orders</p>
                        <p className="text-2xl font-bold text-amber-950">124</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Saved Addresses</p>
                        <p className="text-2xl font-bold text-amber-950">3</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Bell className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Notifications</p>
                        <p className="text-2xl font-bold text-amber-950">12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Add Search component inline
function Search({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
