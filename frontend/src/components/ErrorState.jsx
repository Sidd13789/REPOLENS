export default function ErrorState({
  title = "Something went wrong.",
  description = "Please try again.",
  onRetry,
}) {
  return (
    <div className="text-center py-16 border border-red-900/50 bg-red-950/20 rounded-xl">
      <p className="font-semibold text-lg text-red-400">{title}</p>
      <p className="text-gray-400 text-sm mt-1">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 text-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
