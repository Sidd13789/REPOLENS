import { Link } from "react-router-dom";

export default function MobileMenu({ open, onClose }) {
  if (!open) return null;

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Analyze Repository", path: "/dashboard/analyze" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="relative h-full w-72 bg-white p-5 shadow-xl dark:bg-gray-950">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-bold">RepoLens</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="block rounded-lg px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}