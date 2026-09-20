import { useState } from "react";
import { useParams } from "react-router-dom";
import { compareVersions } from "../services/repoService";
import StatCard from "../components/StatCard";

export default function ComparePage() {
  const { owner, repo } = useParams();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runCompare = () => {
    if (!from || !to) return;
    setLoading(true);
    setError(null);
    compareVersions(owner, repo, from, to)
      .then(setResult)
      .catch((err) => setError(err.response?.data?.message || "Comparison failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Version A</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Version B</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
          />
        </div>
        <button
          onClick={runCompare}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2 font-medium disabled:opacity-50"
        >
          {loading ? "Comparing..." : "Compare"}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Files Added" value={result.files.added} />
            <StatCard label="Files Modified" value={result.files.modified} />
            <StatCard label="Files Deleted" value={result.files.deleted} />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h2 className="font-semibold mb-3">Contributor Commits in Range</h2>
            <div className="space-y-1 text-sm">
              {result.contributorCommits.map((c) => (
                <div key={c.author} className="flex justify-between">
                  <span>{c.author}</span>
                  <span className="text-gray-400">{c.commits} commits</span>
                </div>
              ))}
              {!result.contributorCommits.length && (
                <p className="text-gray-500">No commits in this range.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
