import Link from "next/link";
import { Header } from "@/components/layout/Header";

const categories = ["Traditional", "Premium", "Box", "Serving", "Combo", "Sweet", "Special", "Deluxe"];

export function CataloguePage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Catalogue</p>
        <h1 className="text-4xl font-black tracking-tight text-amber-950">Browse the full product range</h1>
        <p className="max-w-3xl text-base leading-relaxed text-neutral-700">
          This is the main product discovery page. The detailed product grid can stay here while the landing page focuses on brand story and featured items.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {categories.map((category) => (
          <span key={category} className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
            {category}
          </span>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-dashed border-amber-200 bg-white p-8 text-neutral-700 shadow-sm">
        <h2 className="text-xl font-bold text-amber-950">Next step</h2>
        <p className="mt-2 max-w-2xl leading-7">
          This route is ready to host the main catalog grid. For now, it acts as the named page entry so the app tree stays readable while we migrate the existing product listing here.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800">
          Back to landing
        </Link>
      </div>
    </div>
    </>
  );
}