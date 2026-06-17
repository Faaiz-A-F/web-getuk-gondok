export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; 2024 Getuk Gondok. All rights reserved.</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          <a href="/about-us">About us</a>
          <a href="/catalogue">Catalogue</a>
          <a href="/account">Account</a>
          <a href="/login">Login</a>
        </div>
      </div>
    </footer>
  );
}
