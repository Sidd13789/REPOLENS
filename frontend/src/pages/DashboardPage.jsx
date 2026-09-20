import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getRepo,
  getLanguages,
  getContributors,
  getSnapshot,
  createShareLink,
} from "../services/repoService";

import StatCard from "../components/StatCard";
import LanguageBar from "../components/LanguageBar";
import TimeTravelSlider from "../components/TimeTravelSlider";
import { useToast } from "../context/ToastContext";

export default function DashboardPage() {
  const { owner, repo } = useParams();

  const [data, setData] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [snapshot, setSnapshot] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showToast } = useToast();

  // ==========================================
  // Share repository
  // ==========================================

  const handleShare = async () => {
    try {
      if (!data?._id) {
        showToast("Repository data is not available", "error");
        return;
      }

      const { shareId } = await createShareLink(data._id);

      const url = `${window.location.origin}/share/${shareId}`;

      await navigator.clipboard.writeText(url);

      showToast("Share link copied to clipboard");
    } catch (err) {
      console.error("Share error:", err);

      showToast(
        err.response?.data?.message ||
          "Could not create share link",
        "error"
      );
    }
  };

  // ==========================================
  // Load repository
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadRepository = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          repoData,
          langData,
          contribData,
        ] = await Promise.all([
          getRepo(owner, repo),
          getLanguages(owner, repo),
          getContributors(owner, repo),
        ]);

        if (!mounted) return;

        setData(repoData);
        setLanguages(langData);
        setContributors(
          Array.isArray(contribData)
            ? contribData
            : []
        );
      } catch (err) {
        console.error("Repository loading error:", err);

        if (!mounted) return;

        setError(
          err.response?.data?.message ||
            "Failed to load repository"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRepository();

    return () => {
      mounted = false;
    };
  }, [owner, repo]);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-64 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-5">
        <p className="text-red-600 dark:text-red-400">
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // ==========================================
  // File count
  // ==========================================

  const fileCount =
    data.fileCount ??
    data.filesTracked ??
    data.filesCount ??
    data.files ??
    0;

  return (
    <div className="space-y-6">

      {/* ========================================
          Repository Header
      ======================================== */}

      <div className="flex justify-between items-start gap-4 flex-wrap">

        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold truncate">
            {data.owner || owner}/{data.name || repo}
          </h1>

          {data.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {data.description}
            </p>
          )}
        </div>

        <button
          onClick={handleShare}
          className="
            shrink-0
            bg-gray-100
            hover:bg-gray-200
            dark:bg-gray-800
            dark:hover:bg-gray-700
            border
            border-gray-200
            dark:border-gray-700
            rounded-lg
            px-3
            py-1.5
            text-sm
            transition
          "
        >
          Share
        </button>
      </div>

      {/* ========================================
          Repository Statistics
      ======================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatCard
          label="⭐ Stars"
          value={data.stars ?? 0}
        />

        <StatCard
          label="🍴 Forks"
          value={data.forks ?? 0}
        />

        <StatCard
          label="👥 Contributors"
          value={data.contributorCount ?? 0}
        />

        <StatCard
          label="📝 Commits"
          value={data.commitCount ?? 0}
        />

      </div>

      {/* ========================================
          Files Information
      ======================================== */}

      <div
        className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-xl
          p-4
        "
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              Files Tracked
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Files detected in the repository
            </p>
          </div>

          <span className="text-2xl font-bold">
            {fileCount}
          </span>
        </div>
      </div>

      {/* ========================================
          Languages
      ======================================== */}

      <div
        className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-xl
          p-4
        "
      >
        <h2 className="font-semibold mb-3">
          Languages
        </h2>

        <LanguageBar languages={languages} />
      </div>

      {/* ========================================
          Contributors
      ======================================== */}

      <div
        className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-xl
          p-4
        "
      >
        <h2 className="font-semibold mb-3">
          Top Contributors
        </h2>

        {contributors.length === 0 ? (
          <p className="text-sm text-gray-500">
            No contributor data available.
          </p>
        ) : (
          <div className="flex flex-wrap gap-4">

            {contributors
              .slice(0, 10)
              .map((contributor) => (
                <div
                  key={
                    contributor.username ||
                    contributor.login
                  }
                  className="flex items-center gap-2"
                >
                  {contributor.avatar && (
                    <img
                      src={contributor.avatar}
                      alt={
                        contributor.username ||
                        contributor.login
                      }
                      className="w-8 h-8 rounded-full"
                    />
                  )}

                  <div className="text-sm">
                    <p className="font-medium">
                      {contributor.username ||
                        contributor.login}
                    </p>

                    <p className="text-gray-500">
                      {contributor.contributions || 0}{" "}
                      commits
                    </p>
                  </div>
                </div>
              ))}

          </div>
        )}
      </div>

      {/* ========================================
          Time Travel
      ======================================== */}

      <div>
        <h2 className="font-semibold mb-3">
          ⏳ Time Travel
        </h2>

        <div
          className="
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            rounded-xl
            p-4
          "
        >
          <TimeTravelSlider
            createdAt={data.githubCreatedAt}
            onSelect={async (date) => {
              try {
                const result = await getSnapshot(
                  owner,
                  repo,
                  date
                );

                setSnapshot(result);
              } catch (err) {
                showToast(
                  err.response?.data?.message ||
                    "Could not load snapshot",
                  "error"
                );
              }
            }}
          />
        </div>

        {/* Snapshot */}

        {snapshot && !snapshot.message && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

            <StatCard
              label="Files"
              value={snapshot.files ?? 0}
            />

            <StatCard
              label="Contributors"
              value={snapshot.contributors ?? 0}
            />

            <StatCard
              label="Commits"
              value={snapshot.commits ?? 0}
            />

            <StatCard
              label="Commit SHA"
              value={
                snapshot.commitSha
                  ? snapshot.commitSha.slice(0, 7)
                  : "—"
              }
            />

          </div>
        )}

        {snapshot?.message && (
          <p className="text-gray-500 mt-3 text-sm">
            {snapshot.message}
          </p>
        )}
      </div>

    </div>
  );
}

