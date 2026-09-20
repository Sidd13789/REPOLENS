import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTimeline } from "../services/repoService";

export default function TimelinePage() {
  const { owner, repo } = useParams();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTimeline(owner, repo)
      .then(setTimeline)
      .finally(() => setLoading(false));
  }, [owner, repo]);

  if (loading) return <p className="text-gray-400">Building timeline...</p>;
  if (!timeline.length)
    return <p className="text-gray-500">No commit history to build a timeline from.</p>;

  return (
    <div className="relative pl-6 border-l border-gray-800 space-y-6">
      {timeline.map((month) => (
        <div key={month.month} className="relative">
          <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-blue-500" />
          <p className="font-semibold">
            {new Date(month.month + "-01").toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </p>
          <p className="text-sm text-gray-400">
            {month.commitCount} commits · {month.activeContributors} active
            contributor{month.activeContributors === 1 ? "" : "s"}
          </p>
        </div>
      ))}
    </div>
  );
}
