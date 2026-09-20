import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Analyze Repository", path: "/dashboard/analyze" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-lg font-bold text-gray-900 dark:text-white"
        >
          RepoLens
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          <button
            className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:block"
            aria-label="Notifications"
          >
            🔔
          </button>

          {/* Desktop User */}
          <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 md:block">
            {user?.username || "User"}
          </span>

          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

        </div>
      </div>
    </nav>
  );
}