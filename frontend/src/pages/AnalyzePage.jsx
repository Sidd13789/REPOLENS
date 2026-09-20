import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeRepo, getMyGithubRepos } from "../services/repoService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNotifications } from "../context/NotificationContext";

const steps = [
  "Repository information",
  "Languages",
  "Contributors",
  "Commits",
];

export default function AnalyzePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myRepos, setMyRepos] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { notify } = useNotifications();
  const { user } = useAuth();

  // Only try to list the user's own (possibly private) repos if they've
  // connected GitHub — otherwise this 400s intentionally.
  useEffect(() => {
    if (!user?.githubUsername) return;
    getMyGithubRepos()
      .then(setMyRepos)
      .catch(() => setMyRepos([]));
  }, [user]);

  const runAnalyze = async (url) => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const repository = await analyzeRepo(url);
      showToast("Repository analyzed successfully");
      notify(`Analyzed ${repository.owner}/${repository.name}`);
      navigate(`/dashboard/${repository.owner}/${repository.name}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not analyze this repository. Check the URL and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-1">Analyze a Repository</h1>
      <p className="text-gray-400 mb-6">
        Paste a public (or, if you've connected GitHub, your own private)
        repository URL to start exploring its history.
      </p>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runAnalyze(repoUrl)}
          placeholder="https://github.com/user/repository"
          className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 outline-none focus:border-blue-500"
        />
        <button
          onClick={() => runAnalyze(repoUrl)}
          disabled={loading}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 font-medium transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Repository"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4">
          {error === "Network Error"
            ? "Unable to connect to the server. Check whether the backend is running."
            : error}
        </p>
      )}

      {loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2 text-sm mb-6">
          <p className="text-gray-400 mb-2">Analyzing repository</p>
          {steps.map((s) => (
            <p key={s} className="text-gray-300">
              ⟳ {s}
            </p>
          ))}
        </div>
      )}

      {user?.githubUsername && (
        <div>
          <h2 className="font-semibold mb-2 text-sm text-gray-400">
            Or pick from your GitHub repositories
          </h2>
          {myRepos === null && <p className="text-gray-500 text-sm">Loading...</p>}
          {myRepos?.length === 0 && (
            <p className="text-gray-500 text-sm">No repositories found.</p>
          )}
          <div className="border border-gray-800 rounded-xl divide-y divide-gray-800 max-h-72 overflow-y-auto">
            {myRepos?.map((r) => (
              <button
                key={r.fullName}
                onClick={() => runAnalyze(r.fullName)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-900 flex justify-between items-center"
              >
                <span>
                  {r.fullName}
                  {r.isPrivate && (
                    <span className="ml-2 text-xs text-yellow-500">private</span>
                  )}
                </span>
                <span className="text-gray-500 text-xs">⭐ {r.stars}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
