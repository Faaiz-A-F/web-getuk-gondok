import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="bg-amber-50 border-b-4 border-amber-700">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo getuk_20260505_231853_0000(1).png"
            alt="Getuk Gondok Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
          <div>
            <div className="text-2xl font-bold text-amber-900">Getuk Gondok</div>
            <div className="text-xs text-amber-600 font-semibold">Hj. Sri Rahayu</div>
          </div>
        </Link>
        <ul className="flex gap-6">
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/cart">Cart</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
