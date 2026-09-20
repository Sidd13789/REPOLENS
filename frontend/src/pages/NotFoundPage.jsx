import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white gap-3">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-400">This page doesn't exist.</p>
      <Link
        to="/dashboard"
        className="mt-2 bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
