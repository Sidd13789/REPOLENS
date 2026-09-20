import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getSavedRepos, removeSavedRepo } from "../services/repoService";

import StatCard from "../components/StatCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [saved, setSaved] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);

    getSavedRepos()
      .then((data) => {
        setSaved(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setError("Could not load your saved repositories.");
      });
  };

  useEffect(() => {
    load();
  }, []);

  // Statistics
  const totalRepositories = saved?.length ?? 0;

  const totalCommits =
    saved?.reduce(
      (sum, item) =>
        sum + Number(item?.repository?.commitCount || 0),
      0
    ) ?? 0;

  const totalContributors =
    saved?.reduce(
      (sum, item) =>
        sum + Number(item?.repository?.contributorCount || 0),
      0
    ) ?? 0;

  const totalFiles =
    saved?.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.repository?.fileCount ??
            item?.repository?.filesTracked ??
            item?.repository?.filesCount ??
            0
        ),
      0
    ) ?? 0;

  // Remove saved repository
  const handleRemove = async (repositoryId) => {
    try {
      await removeSavedRepo(repositoryId);

      setSaved((current) =>
        current.filter(
          (item) => item.repository._id !== repositoryId
        )
      );

      showToast("Removed from saved analyses");
    } catch {
      showToast("Could not remove — try again", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            Good to see you,{" "}
            {user?.name?.split(" ")[0] || "there"} 👋
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Explore your analyzed GitHub repositories.
          </p>
        </div>

        <Link
          to="/dashboard/analyze"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          + Analyze Repository
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Repositories Analyzed"
          value={saved === null ? "—" : totalRepositories}
        />

        <StatCard
          label="Total Commits"
          value={saved === null ? "—" : totalCommits}
        />

        <StatCard
          label="Contributors"
          value={saved === null ? "—" : totalContributors}
        />

        <StatCard
          label="Files Tracked"
          value={saved === null ? "—" : totalFiles}
        />
      </div>

      {/* Recent Repositories */}
      <div>
        <h2 className="font-semibold mb-3">
          Recent Repositories
        </h2>

        {/* Error */}
        {error && (
          <ErrorState
            description={error}
            onRetry={load}
          />
        )}

        {/* Loading */}
        {!error && saved === null && (
          <LoadingSkeleton rows={4} />
        )}

        {/* Empty */}
        {!error && saved?.length === 0 && (
          <EmptyState
            title="No repositories analyzed yet."
            description="Analyze your first GitHub repository to start exploring its history."
            action={
              <Link
                to="/dashboard/analyze"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition"
              >
                Analyze Repository
              </Link>
            }
          />
        )}

        {/* Repository List */}
        {saved && saved.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl divide-y divide-gray-200 dark:divide-gray-800 overflow-hidden">
            {saved.map((item) => {
              const repository = item.repository;

              const fileCount =
                repository?.fileCount ??
                repository?.filesTracked ??
                repository?.filesCount ??
                0;

              return (
                <div
                  key={item.savedAnalysisId || repository._id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <Link
                    to={`/dashboard/${repository.owner}/${repository.name}`}
                    className="min-w-0"
                  >
                    <p className="font-medium truncate">
                      {repository.owner}/{repository.name}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {repository.commitCount || 0} commits ·{" "}
                      {fileCount} files · analyzed{" "}
                      {new Date(
                        item.savedAt
                      ).toLocaleDateString()}
                    </p>
                  </Link>

                  <button
                    onClick={() =>
                      handleRemove(repository._id)
                    }
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 shrink-0 ml-3 transition"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}