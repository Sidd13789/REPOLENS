import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCommits } from "../services/repoService";

export default function CommitsPage() {
  const { owner, repo } = useParams();
  const [commits, setCommits] = useState([]);
  const [author, setAuthor] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCommits(owner, repo, { author: author || undefined, page })
      .then((res) => {
        setCommits(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [owner, repo, author, page]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Filter by author username..."
        value={author}
        onChange={(e) => {
          setPage(1);
          setAuthor(e.target.value);
        }}
        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 w-full max-w-sm outline-none focus:border-blue-500"
      />

      {loading ? (
        <p className="text-gray-400">Loading commits...</p>
      ) : (
        <div className="divide-y divide-gray-800 border border-gray-800 rounded-xl overflow-hidden">
          {commits.map((c) => (
            <Link
              key={c.sha}
              to={`/dashboard/${owner}/${repo}/commits/${c.sha}`}
              className="flex justify-between items-center px-4 py-3 hover:bg-gray-900 transition"
            >
              <div>
                <p className="font-medium">
                  {c.message?.split("\n")[0]}
                </p>
                <p className="text-sm text-gray-500">
                  {c.authorLogin || c.authorName} ·{" "}
                  {new Date(c.date).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs text-gray-600 font-mono">
                {c.sha.slice(0, 7)}
              </span>
            </Link>
          ))}
          {!commits.length && (
            <p className="p-4 text-gray-500 text-sm">No commits found.</p>
          )}
        </div>
      )}

      <div className="flex gap-2 items-center text-sm">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded bg-gray-800 disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-gray-400">
          Page {page} · {total} total
        </span>
        <button
          disabled={page * 30 >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded bg-gray-800 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
