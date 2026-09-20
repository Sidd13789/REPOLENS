import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const links = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/dashboard/analyze", label: "Analyze Repository" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col justify-between bg-white dark:bg-gray-950">
      <div>
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <span className="font-bold">CodeTimeMachine</span>
          <NotificationBell />
        </div>
        <nav className="flex flex-col p-2 gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <p className="px-4 pt-2 text-xs text-gray-400 dark:text-gray-600">
          Press ⌘K / Ctrl+K for commands
        </p>
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
        {user?.avatar && (
          <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{user?.name}</p>
          <button onClick={logout} className="text-xs text-gray-500 hover:text-red-400">
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
