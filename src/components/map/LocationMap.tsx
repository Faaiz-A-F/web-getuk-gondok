"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker, LatLngBounds } from "leaflet";

export type MapLocation = {
  id: string;
  name: string;
  role: string;
  address: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
};

export const locations: MapLocation[] = [
  {
    id: "rumah-produksi",
    name: "Rumah Produksi Getuk Gondok",
    role: "Rumah Produksi",
    address: "G643+24F, Karet, Bulurejo, Mertoyudan, Kabupaten Magelang, Jawa Tengah 56172",
    lat: -7.4941075,
    lng: 110.2015508,
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=G643%2B24F+Karet+Bulurejo+Mertoyudan+Magelang",
  },
  {
    id: "toko",
    name: "Toko Getuk Gondok Hj. Sri Rahayu",
    role: "Toko",
    address: "Jl. Mataram No.9A, Rejowinangun Sel., Kec. Magelang Sel., Kota Magelang, Jawa Tengah 56172",
    lat: -7.4849762,
    lng: 110.2215611,
    googleMapsUrl: "https://maps.app.goo.gl/tiqgnVgum8UKeagD9",
  },
];

type LocationMapProps = {
  className?: string;
};

export function LocationMap({ className }: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let map: LeafletMap | null = null;

    (async () => {
      const L = await import("leaflet");

      if (cancelled || !containerRef.current) {
        return;
      }

      // Clean up any existing map instance on the container (HMR safety)
      const existingMap = (containerRef.current as unknown as { _leaflet_id?: number })._leaflet_id;
      if (existingMap !== undefined) {
        containerRef.current.innerHTML = "";
      }

      map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const bounds: LatLngBounds = L.latLngBounds([]);

      locations.forEach((location) => {
        const color = location.id === "rumah-produksi" ? "#E86A17" : "#3D2314";
        const pinSvg = `
          <div style="position: relative; transform: translate(-50%, -100%);">
            <svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="pinShadow-${location.id}" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.35"/>
                </filter>
              </defs>
              <path
                d="M20 0C8.954 0 0 8.954 0 20c0 14 20 32 20 32s20-18 20-32C40 8.954 31.046 0 20 0z"
                fill="${color}"
                filter="url(#pinShadow-${location.id})"
              />
              <circle cx="20" cy="20" r="8" fill="#FAF3E8" />
            </svg>
          </div>
        `;

        const icon = L.divIcon({
          className: "leaflet-custom-pin",
          html: pinSvg,
          iconSize: [40, 52],
          iconAnchor: [20, 52],
          popupAnchor: [0, -48],
        });

        const marker = L.marker([location.lat, location.lng], { icon }).addTo(map!);
        markersRef.current.push(marker);

        const popupHtml = `
          <div style="font-family: 'Playfair Display', Georgia, serif; min-width: 220px; color: #3D2314;">
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #E86A17; margin-bottom: 4px;">
              ${location.role}
            </div>
            <div style="font-size: 16px; font-weight: 700; margin-bottom: 6px; color: #3D2314;">
              ${location.name}
            </div>
            <div style="font-size: 13px; line-height: 1.5; color: #5C3D28; margin-bottom: 10px;">
              ${location.address}
            </div>
            <a
              href="${location.googleMapsUrl}"
              target="_blank"
              rel="noopener noreferrer"
              style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #E86A17; text-decoration: none; padding: 6px 12px; border: 1px solid #E86A17; border-radius: 9999px;"
            >
              Buka di Google Maps
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17L17 7M9 7h8v8"/>
              </svg>
            </a>
          </div>
        `;

        marker.bindPopup(popupHtml, {
          maxWidth: 320,
          className: "getuk-popup",
        });

        bounds.extend([location.lat, location.lng]);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      }

      // Enable scroll wheel zoom only when the user interacts with the map
      map.on("focus click", () => map?.scrollWheelZoom.enable());
      map.on("blur", () => map?.scrollWheelZoom.disable());

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className ?? "h-[460px] w-full rounded-3xl overflow-hidden"}
      style={{ minHeight: 360, zIndex: 0 }}
      aria-label="Peta lokasi Rumah Produksi dan Toko Getuk Gondok"
      role="region"
    />
  );
}

export default LocationMap;
