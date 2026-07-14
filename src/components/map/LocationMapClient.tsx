"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () => import("@/components/map/LocationMap").then((mod) => mod.LocationMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[460px] w-full rounded-3xl bg-[#F5EBE0] border border-[#5C3D28]/10 flex items-center justify-center"
        style={{ minHeight: 360 }}
      >
        <div className="flex flex-col items-center gap-3 text-[#5C3D28]/60">
          <div className="h-10 w-10 rounded-full border-2 border-[#E8C547] border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Memuat peta...</span>
        </div>
      </div>
    ),
  }
);

export function LocationMapClient() {
  return <LocationMap />;
}

export default LocationMapClient;
