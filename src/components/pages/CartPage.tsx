export function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Cart</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-amber-950">Shopping cart</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
        This page will hold your selected products before checkout. We will keep the route stable and move the UI into a dedicated component as the refactor continues.
      </p>
    </div>
  );
}