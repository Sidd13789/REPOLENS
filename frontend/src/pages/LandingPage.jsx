import { Link } from "react-router-dom";

const features = [
  { title: "Repository Analytics", desc: "Commits, contributors, and language mix at a glance." },
  { title: "Commit Explorer", desc: "Search, filter, and drill into every commit's diff." },
  { title: "Contribution Heatmap", desc: "See exactly when a project is most active." },
  { title: "Time Travel", desc: "View a repository's exact state on any past date." },
  { title: "File Evolution", desc: "Track how a single file changed over its lifetime." },
  { title: "Version Comparison", desc: "Diff the whole repo between two points in time." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <span className="font-bold text-lg">RepoLens</span>
        <div className="flex gap-4 items-center text-sm">
          <Link to="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="text-center px-6 py-24 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Understand how your repository evolved over time.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-4">
          Analyze commits, contributors, files, and code changes — and travel
          back to any point in your project's history.
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-3 font-medium"
          >
            Analyze Repository
          </Link>
          <a
            href="/api/auth/github"
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-6 py-3 font-medium"
          >
            Continue with GitHub
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 px-6 pb-24 max-w-5xl mx-auto">
        {features.map((f) => (
          <div key={f.title} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-800 px-6 py-8 text-center text-sm text-gray-500">
        RepoLens — built with the GitHub REST API.
      </footer>
    </div>
  );
}
