"use client"
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import MagelangImage from "../../assets/images/magelang fiks.png";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { User, MapPin, Mail, Phone, Calendar, Shield, CreditCard, Bell, Settings, ChevronRight, Clock, Package, Camera, Check, Loader2, Truck, DollarSign, Search, Filter, FileText, RefreshCw, X } from "lucide-react";

// ========== Module-level EditableField ==========
// Defined outside AccountPage so its type reference is stable across renders.
// If defined inside the parent, React unmounts/remounts the input on every
// state update, causing focus loss and the "can only type one char" bug.

type ProfileField = "firstName" | "lastName" | "phone" | "dob" | "country" | "city" | "postal";

interface EditableFieldProps {
  field: ProfileField;
  value: string;
  onChange: (field: ProfileField, value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const EditableField = React.memo(function EditableField({
  field,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
}: EditableFieldProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value),
    [field, onChange]
  );

  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C87536] pointer-events-none" />
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-white border border-[#E8D4C4] rounded-xl text-[#4A1D0B] focus:outline-none focus:ring-2 focus:ring-[#C87536] focus:border-[#C87536] transition-colors`}
      />
    </div>
  );
});

// ========== Module-level SaveChangesBar ==========
// Also moved to module level to keep type reference stable.

interface SaveChangesBarProps {
  section: "profile" | "address";
  dirty: boolean;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const SaveChangesBar = React.memo(function SaveChangesBar({
  section,
  dirty,
  saving,
  saved,
  onSave,
  onCancel,
}: SaveChangesBarProps) {
  if (!dirty && !saving && !saved) return null;

  return (
    <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-[#E8D4C4]">
      <div className="flex items-center gap-2 text-xs">
        {saving && (
          <span className="inline-flex items-center gap-1.5 text-[#C87536] font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan perubahan...
          </span>
        )}
        {!saving && saved && (
          <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
            <Check className="w-3.5 h-3.5" /> Perubahan berhasil disimpan
          </span>
        )}
        {!saving && !saved && dirty && (
          <span className="inline-flex items-center gap-1.5 text-amber-600 font-medium">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            Anda memiliki perubahan yang belum disimpan
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 text-sm font-semibold text-[#8B6F47] bg-white border border-[#E8D4C4] rounded-xl hover:bg-[#F8E8BD] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#D29A2A] to-[#C87536] rounded-xl hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
});

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
  const { user, setUser } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "password">("profile");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Sync activeTab with ?tab= query param so deep-links like /account?tab=orders work
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "orders" || tab === "password" || tab === "profile") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Helper to switch tab and update the URL (no scroll, replace to avoid history spam)
  const switchTab = useCallback(
    (tab: "profile" | "orders" | "password") => {
      setActiveTab(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );
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

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect mobile device
  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Fetch existing profile picture on mount
  useEffect(() => {
    if (!user) return;
    fetch(`/api/user/profile-picture?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.profilePicture) {
          setProfilePicture(data.profilePicture);
        }
      })
      .catch((e) => console.error("Error fetching profile picture:", e));
  }, [user]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setProfilePictureError("File harus berupa gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setProfilePictureError("Ukuran file maksimal 5MB");
      return;
    }

    setProfilePictureError("");
    setProfilePictureLoading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setProfilePicture(base64); // Optimistic preview

      // Upload to server
      try {
        const res = await fetch("/api/user/profile-picture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id, image: base64 }),
        });

        if (!res.ok) {
          throw new Error("Upload failed");
        }
      } catch (err) {
        console.error("Error uploading profile picture:", err);
        setProfilePictureError("Gagal mengupload foto");
      } finally {
        setProfilePictureLoading(false);
      }
    };
    reader.readAsDataURL(file);

    // Reset input value so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file picker (gallery on mobile, file dialog on desktop)
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // ========== Order History enhanced UI state ==========
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const orderStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "done":
      case "delivered":
        return { label: "Selesai", className: "bg-green-100 text-green-700", dotColor: "bg-green-500" };
      case "shipped":
      case "sent":
        return { label: "Dikirim", className: "bg-amber-100 text-amber-700", dotColor: "bg-amber-500" };
      case "pending":
      case "processing":
      case "paid":
        return { label: "Diproses", className: "bg-yellow-100 text-yellow-700", dotColor: "bg-yellow-500" };
      case "cancelled":
        return { label: "Dibatalkan", className: "bg-red-100 text-red-700", dotColor: "bg-red-500" };
      default:
        return { label: status, className: "bg-gray-100 text-gray-700", dotColor: "bg-gray-500" };
    }
  };

  // ========== Real-time editable profile state ==========
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    country: "",
    city: "",
    postal: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch full profile data on mount / user change
  useEffect(() => {
    if (!user) return;
    setProfileLoading(true);
    fetch(`/api/user/profile?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          const nameParts = (data.name || "").trim().split(" ");
          setProfileData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            phone: data.phone || "",
            dob: data.dob || "",
            country: data.country || "",
            city: data.city || "",
            postal: data.postal || "",
          });
        }
      })
      .catch((e) => console.error("Error fetching profile:", e))
      .finally(() => setProfileLoading(false));
  }, [user]);

  // Local-only field update — actual save happens via "Save Changes" button
  const handleFieldChange = useCallback((field: ProfileField, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ========== Manual "Save Changes" support ==========
  // Track which section has unsaved changes (dirty state)
  const [profileDirty, setProfileDirty] = useState(false);
  const [addressDirty, setAddressDirty] = useState(false);
  const [manualSaving, setManualSaving] = useState<"profile" | "address" | null>(null);
  const [manualSaved, setManualSaved] = useState<"profile" | "address" | null>(null);

  // Personal info fields (excluding address fields)
  const profileFields = useMemo<ProfileField[]>(() => ["firstName", "lastName", "dob", "phone"], []);
  // Address fields
  const addressFields = useMemo<ProfileField[]>(() => ["country", "city", "postal"], []);

  // Watch profileData for changes (compared to last saved snapshot)
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    country: "",
    city: "",
    postal: "",
  });

  useEffect(() => {
    // After profile loads, treat current values as the saved baseline
    if (!profileLoading && !lastSavedSnapshot.firstName && !lastSavedSnapshot.lastName && profileData.firstName) {
      setLastSavedSnapshot(profileData);
    }
  }, [profileLoading, profileData, lastSavedSnapshot]);

  useEffect(() => {
    const profileChanged = profileFields.some(
      (f) => profileData[f] !== lastSavedSnapshot[f]
    );
    const addressChanged = addressFields.some(
      (f) => profileData[f] !== lastSavedSnapshot[f]
    );
    setProfileDirty(profileChanged);
    setAddressDirty(addressChanged);
  }, [profileData, lastSavedSnapshot, profileFields, addressFields]);

  // Manual save handler — saves the whole section in one request
  const handleManualSave = useCallback(async (section: "profile" | "address") => {
    if (!user) return;
    setManualSaving(section);
    setManualSaved(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...profileData }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser({ ...user, name: data.user.name, phone: data.user.phone ?? "" });
        }
        // Update baseline so dirty flag resets
        setLastSavedSnapshot(profileData);
        setProfileDirty(false);
        setAddressDirty(false);
        setManualSaved(section);
        // Flash "Saved" badge for 2s
        setTimeout(() => setManualSaved((cur) => (cur === section ? null : cur)), 2000);
      } else {
        console.error("Manual save failed");
      }
    } catch (e) {
      console.error("Error manual save:", e);
    } finally {
      setManualSaving(null);
    }
  }, [user, profileData, setUser]);

  // Cancel / revert section to last saved snapshot
  const handleCancel = useCallback((section: "profile" | "address") => {
    const fields = section === "profile" ? profileFields : addressFields;
    const reverted: typeof profileData = { ...profileData };
    fields.forEach((f) => {
      reverted[f] = lastSavedSnapshot[f];
    });
    setProfileData(reverted);
  }, [profileFields, addressFields, lastSavedSnapshot, profileData]);

  // Stable callback factories for SaveChangesBar
  const saveProfile = useCallback(() => handleManualSave("profile"), [handleManualSave]);
  const cancelProfile = useCallback(() => handleCancel("profile"), [handleCancel]);
  const saveAddress = useCallback(() => handleManualSave("address"), [handleManualSave]);
  const cancelAddress = useCallback(() => handleCancel("address"), [handleCancel]);

  // SaveChangesBar is now defined at module level (see top of file)

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

  // Display values pulled from auth + real-time profile state
  const displayName = profileData.firstName
    ? [profileData.firstName, profileData.lastName].filter(Boolean).join(" ")
    : user?.name ?? "User";
  const display = {
    name: displayName,
    role: user?.role ?? "Customer",
    location: [profileData.city, profileData.country].filter(Boolean).join(", ") || "—",
    email: user?.email ?? "—",
    phone: profileData.phone || "—",
    dob: profileData.dob || "—",
    postal: profileData.postal || "—",
    city: profileData.city || "—",
    country: profileData.country || "—",
  };

  // EditableField is now defined at module level (see top of file)
  // to keep a stable component type reference across renders.

  const navItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders", label: "Order History", icon: Package },
    { id: "password", label: "Change Password", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#F8E8BD] relative">
      {/* Hidden file input — opens gallery on mobile, file picker on desktop */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      {/* Background Image */}
      <div className="hidden lg:block fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src={MagelangImage}
          alt="Magelang"
          fill
          priority
          className="object-cover object-center opacity-50"
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
                      <div className="relative inline-block group">
                        <button
                          type="button"
                          onClick={handleAvatarClick}
                          className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#D29A2A] to-[#C87536] mx-auto flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C87536] focus:ring-offset-2"
                          aria-label="Ubah foto profil"
                        >
                          {profilePicture ? (
                            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white text-3xl font-bold">{display.name?.charAt(0).toUpperCase()}</span>
                          )}
                          {/* Camera overlay on hover */}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Camera className="w-7 h-7 text-white" />
                          </div>
                          {/* Loading spinner overlay */}
                          {profilePictureLoading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                            </div>
                          )}
                        </button>
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white pointer-events-none"></div>
                      </div>
                      {profilePictureError && (
                        <p className="text-xs text-red-600 mt-2">{profilePictureError}</p>
                      )}
                      <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#C87536] hover:text-[#A85E2E] transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        {isMobile ? "Pilih dari Galeri" : "Upload Foto"}
                      </button>
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
                            onClick={() => switchTab(item.id as "profile" | "orders" | "password")}
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
                          <button
                            type="button"
                            onClick={handleAvatarClick}
                            className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#D29A2A] to-[#C87536] flex items-center justify-center flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8C547] focus:ring-offset-2 focus:ring-offset-[#4A1D0B] group"
                            aria-label="Ubah foto profil"
                          >
                            {profilePicture ? (
                              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white text-2xl font-bold">{display.name?.charAt(0).toUpperCase()}</span>
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Camera className="w-6 h-6 text-white" />
                            </div>
                            {profilePictureLoading && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                              </div>
                            )}
                          </button>
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold">{display.name}</h2>
                            <p className="text-[#D29A2A]">{display.role}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-[#F8E8BD]">
                              <MapPin className="w-4 h-4" />
                              {display.location}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8E8BD]/10 text-[#F8E8BD] text-xs font-medium rounded-xl border border-[#F8E8BD]/20">
                              <span className="w-2 h-2 bg-[#E8C547] rounded-full"></span>
                              Manual save
                            </div>
                            <p className="text-[10px] text-[#F8E8BD]/60 pr-1">Klik Save Changes untuk menyimpan</p>
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
                              <EditableField
                                field="firstName"
                                value={profileData.firstName}
                                onChange={handleFieldChange}
                                placeholder="Nama depan"
                              />
                            </div>
                            {/* Last Name */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Last Name</label>
                              <EditableField
                                field="lastName"
                                value={profileData.lastName}
                                onChange={handleFieldChange}
                                placeholder="Nama belakang"
                              />
                            </div>
                            {/* Date of Birth */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Date of Birth</label>
                              <EditableField
                                field="dob"
                                value={profileData.dob}
                                onChange={handleFieldChange}
                                type="date"
                                icon={Calendar}
                              />
                            </div>
                            {/* Email (read-only) */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Email Address</label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C87536]/50" />
                                <div className="w-full pl-10 pr-4 py-3 bg-[#F8E8BD]/50 border border-[#E8D4C4] rounded-xl text-[#4A1D0B]/70 cursor-not-allowed">
                                  {display.email}
                                </div>
                              </div>
                              <p className="text-[10px] text-[#8B6F47] px-1">Email tidak dapat diubah</p>
                            </div>
                            {/* Phone */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Phone Number</label>
                              <EditableField
                                field="phone"
                                value={profileData.phone}
                                onChange={handleFieldChange}
                                type="tel"
                                placeholder="+62 xxx-xxxx-xxxx"
                                icon={Phone}
                              />
                            </div>
                            {/* User Role (read-only) */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">User Role</label>
                              <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C87536]/50" />
                                <div className="w-full pl-10 pr-4 py-3 bg-[#F8E8BD]/50 border border-[#E8D4C4] rounded-xl text-[#4A1D0B]/70 cursor-not-allowed">
                                  {display.role}
                                </div>
                              </div>
                            </div>
                          </div>
                          <SaveChangesBar
                            section="profile"
                            dirty={profileDirty}
                            saving={manualSaving === "profile"}
                            saved={manualSaved === "profile"}
                            onSave={saveProfile}
                            onCancel={cancelProfile}
                          />
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
                              <EditableField
                                field="country"
                                value={profileData.country}
                                onChange={handleFieldChange}
                                placeholder="Negara"
                              />
                            </div>
                            {/* City */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">City</label>
                              <EditableField
                                field="city"
                                value={profileData.city}
                                onChange={handleFieldChange}
                                placeholder="Kota"
                              />
                            </div>
                            {/* Postal Code */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider">Postal Code</label>
                              <EditableField
                                field="postal"
                                value={profileData.postal}
                                onChange={handleFieldChange}
                                placeholder="Kode pos"
                              />
                            </div>
                          </div>
                          <SaveChangesBar
                            section="address"
                            dirty={addressDirty}
                            saving={manualSaving === "address"}
                            saved={manualSaved === "address"}
                            onSave={saveAddress}
                            onCancel={cancelAddress}
                          />
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
                      {/* Order History Page Header */}
                      <div className="bg-gradient-to-r from-[#7A4A1E] via-[#6B3A1D] to-[#7A4A1E] text-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#D29A2A] flex items-center justify-center shadow-md">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Riwayat Pesanan</h1>
                            <p className="text-[#F8E8BD]/80 text-sm">Lacak dan kelola semua pesanan Anda</p>
                          </div>
                        </div>
                      </div>

                      {(() => {
                        // Filtered orders
                        const filtered = orders.filter((o) => {
                          const matchesStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
                          const matchesSearch =
                            searchQuery === "" ||
                            o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            o.items.some((it) => it.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
                          return matchesStatus && matchesSearch;
                        });

                        const totalOrders = orders.length;
                        const pendingOrders = orders.filter((o) => ["pending", "processing", "paid"].includes(o.status.toLowerCase())).length;
                        const shippedOrders = orders.filter((o) => ["shipped", "sent"].includes(o.status.toLowerCase())).length;
                        const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

                        return (
                          <div className="space-y-4">
                            {/* Filter Bar */}
                            <div className="bg-[#F7F7F5] rounded-2xl shadow-lg p-4 border border-[#E8D4C4]">
                              <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className="flex items-center gap-2">
                                  <Filter className="w-5 h-5 text-[#C87536]" />
                                  <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2.5 bg-[#F8E8BD] border border-[#E8D4C4] rounded-xl text-[#4A1D0B] focus:outline-none focus:ring-2 focus:ring-[#C87536] cursor-pointer"
                                  >
                                    <option value="all">Semua Status</option>
                                    <option value="pending">Diproses</option>
                                    <option value="shipped">Dikirim</option>
                                    <option value="done">Selesai</option>
                                    <option value="cancelled">Dibatalkan</option>
                                  </select>
                                </div>
                                <div className="flex-1 relative">
                                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
                                  <input
                                    type="text"
                                    placeholder="Cari nomor pesanan atau produk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2.5 bg-[#F8E8BD] border border-[#E8D4C4] rounded-xl text-[#4A1D0B] placeholder-[#8B6F47] focus:outline-none focus:ring-2 focus:ring-[#C87536]"
                                  />
                                  {searchQuery && (
                                    <button
                                      onClick={() => setSearchQuery("")}
                                      className="absolute right-4 top-1/2 -translate-y-1/2"
                                    >
                                      <X className="w-4 h-4 text-[#8B6F47] hover:text-[#4A1D0B]" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-[#F7F7F5] rounded-2xl p-5 shadow-md border border-[#E8D4C4] hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#F8E8BD] rounded-xl flex items-center justify-center mb-3">
                                  <Package className="w-6 h-6 text-[#C87536]" />
                                </div>
                                <p className="text-3xl font-bold text-[#4A1D0B]">{totalOrders}</p>
                                <p className="text-sm text-[#8B6F47]">Total Pesanan</p>
                              </div>
                              <div className="bg-[#F7F7F5] rounded-2xl p-5 shadow-md border border-[#E8D4C4] hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-3">
                                  <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                                <p className="text-3xl font-bold text-[#4A1D0B]">{pendingOrders}</p>
                                <p className="text-sm text-[#8B6F47]">Sedang Diproses</p>
                              </div>
                              <div className="bg-[#F7F7F5] rounded-2xl p-5 shadow-md border border-[#E8D4C4] hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                                  <Truck className="w-6 h-6 text-blue-600" />
                                </div>
                                <p className="text-3xl font-bold text-[#4A1D0B]">{shippedOrders}</p>
                                <p className="text-sm text-[#8B6F47]">Dalam Pengiriman</p>
                              </div>
                              <div className="bg-[#F7F7F5] rounded-2xl p-5 shadow-md border border-[#E8D4C4] hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                                  <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-xl md:text-2xl font-bold text-[#4A1D0B]">
                                  {totalSpent >= 1000000
                                    ? `Rp ${(totalSpent / 1000000).toFixed(1)}M`
                                    : formatPrice(totalSpent)}
                                </p>
                                <p className="text-sm text-[#8B6F47]">Total Belanja</p>
                              </div>
                            </div>

                            {/* Order List */}
                            {ordersLoading ? (
                              <div className="flex items-center justify-center py-16 bg-[#F7F7F5] rounded-2xl shadow-md border border-[#E8D4C4]">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F8E8BD] border-t-[#C87536]"></div>
                              </div>
                            ) : filtered.length === 0 ? (
                              <div className="text-center py-16 bg-[#F7F7F5] rounded-2xl shadow-md border border-[#E8D4C4]">
                                <div className="w-24 h-24 bg-[#F8E8BD] rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Package className="w-12 h-12 text-[#C87536]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#4A1D0B] mb-2">Belum ada pesanan</h3>
                                <p className="text-[#8B6F47] mb-6">
                                  {searchQuery || statusFilter !== "all"
                                    ? "Tidak ada pesanan yang cocok dengan filter Anda"
                                    : "Mulai belanja untuk melihat pesanan di sini"}
                                </p>
                                <a
                                  href="/catalogue"
                                  className="inline-block px-8 py-3 bg-gradient-to-r from-[#D29A2A] to-[#C87536] hover:opacity-90 text-white font-semibold rounded-full transition-all shadow-lg"
                                >
                                  Mulai Belanja
                                </a>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {filtered.map((order) => {
                                  const statusConfig = orderStatusConfig(order.status);
                                  return (
                                    <article
                                      key={order.id}
                                      className="bg-[#F7F7F5] rounded-2xl shadow-md border border-[#E8D4C4] overflow-hidden hover:shadow-lg transition-all"
                                    >
                                      {/* Order Header */}
                                      <div className="p-5 bg-gradient-to-r from-[#F8E8BD] to-white border-b border-[#E8D4C4]">
                                        <div className="flex flex-wrap justify-between items-start gap-4">
                                          <div>
                                            <h3 className="text-lg font-bold text-[#4A1D0B]">{order.orderNumber}</h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-[#8B6F47]">
                                              <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {formatDate(order.createdAt)}
                                              </span>
                                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                order.paymentStatus === "PAID"
                                                  ? "bg-green-100 text-green-700"
                                                  : order.paymentStatus === "UNPAID"
                                                  ? "bg-yellow-100 text-yellow-700"
                                                  : "bg-gray-100 text-gray-700"
                                              }`}>
                                                {order.paymentStatus === "PAID" ? "Lunas" : order.paymentStatus}
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
                                            <div key={item.id} className="flex items-center gap-4 p-3 bg-[#F8E8BD] rounded-xl">
                                              <div className="w-14 h-14 bg-[#E8D4C4] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                <Package className="w-6 h-6 text-[#8B6F47]" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-[#4A1D0B] truncate">{item.product?.name || "Produk"}</p>
                                                <p className="text-sm text-[#8B6F47]">
                                                  Qty: {item.quantity} × {formatPrice(Number(item.price))}
                                                </p>
                                              </div>
                                              <p className="font-bold text-[#4A1D0B]">{formatPrice(Number(item.subtotal))}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Order Footer */}
                                      <div className="px-5 py-4 bg-[#F8E8BD] border-t border-[#E8D4C4] flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                          <p className="text-xs text-[#8B6F47] uppercase tracking-wide">Total Pesanan</p>
                                          <p className="text-2xl font-bold text-[#4A1D0B]">{formatPrice(Number(order.totalAmount))}</p>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8D4C4] text-[#4A1D0B] rounded-xl hover:bg-[#E8D4C4]/40 transition-colors font-medium">
                                            <FileText className="w-4 h-4" />
                                            Detail
                                          </button>
                                          {order.status.toLowerCase() === "done" && (
                                            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D29A2A] to-[#C87536] text-white rounded-xl hover:opacity-90 transition-opacity font-medium">
                                              <RefreshCw className="w-4 h-4" />
                                              Beli Lagi
                                            </button>
                                          )}
                                          {(order.status.toLowerCase() === "shipped" || order.status.toLowerCase() === "sent") && (
                                            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D29A2A] to-[#C87536] text-white rounded-xl hover:opacity-90 transition-opacity font-medium">
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
                          </div>
                        );
                      })()}
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
