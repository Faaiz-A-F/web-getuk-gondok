export function AboutUsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">About us</p>
        <h1 className="text-4xl font-black tracking-tight text-amber-950">A family recipe from Magelang</h1>
        <p className="max-w-3xl text-base leading-relaxed text-neutral-700">
          Getuk Gondok Hj. Sri Rahayu started with a small home kitchen and a simple rule: keep the recipe honest.
          The brand now serves traditional cakes, premium hampers, and event-ready packaging while keeping that same approach.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          ["1985", "Established"],
          ["40+", "Years of making traditional snacks"],
          ["1000+", "Customers served"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-3xl bg-amber-950 p-6 text-white shadow-lg">
            <div className="text-4xl font-black text-amber-400">{value}</div>
            <p className="mt-3 text-sm leading-6 text-amber-100">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}