import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedAnalysis } from "../services/repoService";
import StatCard from "../components/StatCard";
import ErrorState from "../components/ErrorState";
import LoadingSkeleton from "../components/LoadingSkeleton";

// Public page — no login required.
export default function SharePage() {
  const { shareId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSharedAnalysis(shareId)
      .then(setData)
      .catch(() => setError("This share link is invalid or has expired."));
  }, [shareId]);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-500 text-sm mb-6">CodeTimeMachine — shared analysis</p>

        {error && <ErrorState description={error} />}
        {!error && !data && <LoadingSkeleton rows={4} />}

        {data && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">
                {data.owner}/{data.name}
              </h1>
              <p className="text-gray-400">{data.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Commits" value={data.commitCount} />
              <StatCard label="Contributors" value={data.contributorCount} />
              <StatCard label="Stars" value={data.stars} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
