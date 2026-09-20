import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-lg space-y-8">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      {/* Account */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2 text-sm text-gray-900 dark:text-white">
        <h2 className="font-semibold mb-2">
          Account
        </h2>

        <p>
          <span className="text-gray-500 dark:text-gray-400">
            Name:
          </span>{" "}
          {user?.name}
        </p>

        <p>
          <span className="text-gray-500 dark:text-gray-400">
            Username:
          </span>{" "}
          {user?.username}
        </p>

        <p>
          <span className="text-gray-500 dark:text-gray-400">
            Email:
          </span>{" "}
          {user?.email}
        </p>
      </section>

      {/* GitHub */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2 text-sm">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">
          GitHub
        </h2>

        <p className="text-gray-600 dark:text-gray-400">
          {user?.githubUsername
            ? `Connected as @${user.githubUsername}`
            : "Not connected — sign in with GitHub from the login page to link your account."}
        </p>
      </section>

      {/* Preferences */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3 text-sm">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">
          Preferences
        </h2>

        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-600 dark:text-gray-400">
            Theme
          </span>

          <button
            onClick={toggleTheme}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700"
          >
            {theme === "dark" ? "🌙 Dark" : "☀ Light"} — switch
          </button>
        </div>
      </section>

      {/* Security */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3 text-sm">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">
          Security
        </h2>

        <button
          onClick={logout}
          className="bg-red-50 text-red-600 hover:bg-red-100 rounded-lg px-4 py-2 transition dark:bg-red-600/20 dark:text-red-400 dark:hover:bg-red-600/30"
        >
          Logout
        </button>
      </section>
    </div>
  );
}