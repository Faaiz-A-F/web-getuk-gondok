export function AccountPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Account</p>
        <h1 className="text-4xl font-black tracking-tight text-amber-950">Your account hub</h1>
        <p className="max-w-2xl text-base leading-relaxed text-neutral-700">
          Review your profile, track orders, manage saved addresses, and keep your checkout details ready in one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: "Profile", description: "Update your name, phone number, and contact details." },
          { title: "Orders", description: "See order status, history, and repeat purchases." },
          { title: "Addresses", description: "Store pickup and delivery details for faster checkout." },
          { title: "Settings", description: "Manage account preferences and notification settings." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-amber-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}