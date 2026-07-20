import Image from "next/image";

export default function Loading() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#f8f6f2]" role="status" aria-label="Memuat halaman">
      <div className="flex flex-col items-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-stone-200/70">
          <Image src="/logo/13.png" alt="" width={66} height={66} className="h-16 w-16 object-contain" priority />
        </span>
        <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-stone-200">
          <div className="h-full w-1/2 animate-[admin-loading_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-amber-700 to-amber-500" />
        </div>
        <p className="mt-3 text-sm font-semibold text-stone-500">Menyiapkan halaman...</p>
      </div>
    </div>
  );
}
