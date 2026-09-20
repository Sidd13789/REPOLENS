import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toggleTheme } = useTheme();

  const commands = useMemo(
    () => [
      { label: "Analyze repository", action: () => navigate("/dashboard/analyze") },
      { label: "Open dashboard", action: () => navigate("/dashboard") },
      { label: "Open profile", action: () => navigate("/profile") },
      { label: "Open settings", action: () => navigate("/settings") },
      { label: "Toggle dark / light mode", action: toggleTheme },
      { label: "Logout", action: logout },
    ],
    [navigate, toggleTheme, logout]
  );

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const run = (cmd) => {
    cmd.action();
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-24"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search or run a command..."
          className="w-full bg-transparent px-4 py-3 outline-none border-b border-gray-800 text-white"
        />
        <div className="max-h-72 overflow-y-auto">
          {filtered.map((c) => (
            <button
              key={c.label}
              onClick={() => run(c)}
              className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
            >
              &gt; {c.label}
            </button>
          ))}
          {!filtered.length && (
            <p className="px-4 py-3 text-sm text-gray-500">No matching commands.</p>
          )}
        </div>
      </div>
    </div>
  );
}
