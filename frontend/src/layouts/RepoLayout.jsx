import { Link, Outlet, useParams, useLocation } from "react-router-dom";

const tabs = [
  { path: "", label: "Overview" },
  { path: "commits", label: "Commits" },
  { path: "timeline", label: "Timeline" },
  { path: "analytics", label: "Analytics" },
  { path: "files", label: "Files" },
  { path: "compare", label: "Compare" },
];

export default function RepoLayout() {
  const { owner, repo } = useParams();
  const location = useLocation();
  const base = `/dashboard/${owner}/${repo}`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <Link to="/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-1">
          {owner}/{repo}
        </h1>
      </header>

      <nav className="flex gap-1 px-6 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        {tabs.map((tab) => {
          const to = tab.path ? `${base}/${tab.path}` : base;
          const active =
            location.pathname === to ||
            (tab.path === "" && location.pathname === base);
          return (
            <Link
              key={tab.label}
              to={to}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
                active
                  ? "border-blue-500 text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
