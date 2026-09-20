import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCommitDetail } from "../services/repoService";

export default function CommitDetailPage() {
  const { owner, repo, sha } = useParams();
  const [commit, setCommit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCommitDetail(owner, repo, sha)
      .then(setCommit)
      .finally(() => setLoading(false));
  }, [owner, repo, sha]);

  if (loading) return <p className="text-gray-400">Loading commit...</p>;
  if (!commit) return <p className="text-red-400">Commit not found.</p>;

  return (
    <div className="space-y-6">
      <Link
        to={`/dashboard/${owner}/${repo}/commits`}
        className="text-sm text-gray-400 hover:text-white"
      >
        ← Back to commits
      </Link>

      <div>
        <h2 className="text-xl font-semibold whitespace-pre-wrap">
          {commit.message}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {commit.authorLogin || commit.authorName} ·{" "}
          {new Date(commit.date).toLocaleString()} ·{" "}
          <span className="font-mono">{commit.sha}</span>
        </p>
        <p className="text-sm mt-2">
          <span className="text-green-400">+{commit.additions}</span>{" "}
          <span className="text-red-400">-{commit.deletions}</span>
        </p>
      </div>

      <div className="space-y-4">
        {commit.filesChanged?.map((f) => (
          <div
            key={f.filename}
            className="border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="bg-gray-900 px-4 py-2 flex justify-between text-sm">
              <span className="font-mono">{f.filename}</span>
              <span className="text-gray-500">
                {f.status} · <span className="text-green-400">+{f.additions}</span>{" "}
                <span className="text-red-400">-{f.deletions}</span>
              </span>
            </div>
            {f.patch && (
              <pre className="bg-black text-xs p-4 overflow-x-auto whitespace-pre">
                {f.patch}
              </pre>
            )}
          </div>
        ))}
        {!commit.filesChanged?.length && (
          <p className="text-gray-500 text-sm">No file diff available.</p>
        )}
      </div>
    </div>
  );
}
