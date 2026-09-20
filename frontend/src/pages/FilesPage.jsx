import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFileTree, getFileHistory } from "../services/repoService";

export default function FilesPage() {
  const { owner, repo } = useParams();
  const [tree, setTree] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFileTree(owner, repo)
      .then((t) => setTree(t.filter((n) => n.type === "blob")))
      .finally(() => setLoading(false));
  }, [owner, repo]);

  const selectFile = (path) => {
    setSelected(path);
    setHistoryLoading(true);
    getFileHistory(owner, repo, path)
      .then(setHistory)
      .finally(() => setHistoryLoading(false));
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="font-semibold mb-3">Files ({tree.length})</h2>
        {loading ? (
          <p className="text-gray-400">Loading file tree...</p>
        ) : (
          <div className="border border-gray-800 rounded-xl max-h-[500px] overflow-y-auto">
            {tree.map((f) => (
              <button
                key={f.path}
                onClick={() => selectFile(f.path)}
                className={`w-full text-left px-3 py-2 text-sm font-mono border-b border-gray-800 hover:bg-gray-900 ${
                  selected === f.path ? "bg-gray-900 text-blue-400" : "text-gray-300"
                }`}
              >
                {f.path}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-semibold mb-3">File Evolution</h2>
        {!selected && (
          <p className="text-gray-500 text-sm">Select a file to see its history.</p>
        )}
        {selected && historyLoading && (
          <p className="text-gray-400 text-sm">Loading history for {selected}...</p>
        )}
        {selected && !historyLoading && history && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
            <p className="font-mono text-sm text-blue-400">{selected}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p>
                <span className="text-gray-500">Created:</span>{" "}
                {new Date(history.created).toLocaleDateString()}
              </p>
              <p>
                <span className="text-gray-500">Last modified:</span>{" "}
                {new Date(history.lastModified).toLocaleDateString()}
              </p>
              <p>
                <span className="text-gray-500">Changes:</span> {history.totalChanges}
              </p>
              <p>
                <span className="text-gray-500">Contributors:</span>{" "}
                {history.contributors}
              </p>
            </div>
            <div className="border-t border-gray-800 pt-3 space-y-2 max-h-64 overflow-y-auto">
              {history.history.map((h) => (
                <div key={h.sha} className="text-sm">
                  <p>{h.message?.split("\n")[0]}</p>
                  <p className="text-gray-500 text-xs">
                    {h.authorLogin} · {new Date(h.date).toLocaleDateString()} ·{" "}
                    <span className="font-mono">{h.sha.slice(0, 7)}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
