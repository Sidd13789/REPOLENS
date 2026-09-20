import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getAnalytics, getHeatmap } from "../services/repoService";
import Heatmap from "../components/Heatmap";

export default function AnalyticsPage() {
  const { owner, repo } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getAnalytics(owner, repo), getHeatmap(owner, repo)])
      .then(([a, h]) => {
        setAnalytics(a);
        setHeatmap(h);
      })
      .finally(() => setLoading(false));
  }, [owner, repo]);

  if (loading) return <p className="text-gray-400">Crunching analytics...</p>;
  if (!analytics) return null;

  return (
    <div className="space-y-8">
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Commits Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={analytics.commitsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid #374151" }}
            />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Additions vs Deletions</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics.additionsDeletions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid #374151" }}
            />
            <Bar dataKey="additions" fill="#22c55e" />
            <Bar dataKey="deletions" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Contributor Activity</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics.contributorActivity.slice(0, 10)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis
              dataKey="author"
              type="category"
              width={100}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid #374151" }}
            />
            <Bar dataKey="commits" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Commit Heatmap</h2>
        <Heatmap grid={heatmap} />
      </section>
    </div>
  );
}
