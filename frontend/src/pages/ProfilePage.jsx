import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-lg space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-16 h-16 rounded-full"
          />
        )}

        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {user.name}
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            @{user.username}
          </p>

          {user.githubUsername && (
            <a
              href={`https://github.com/${user.githubUsername}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              GitHub Profile ↗
            </a>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-sm space-y-2 text-gray-900 dark:text-white">
        <p>
          <span className="text-gray-500 dark:text-gray-400">
            Email:
          </span>{" "}
          {user.email}
        </p>
      </div>
    </div>
  );
}