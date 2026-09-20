export default function LoadingSkeleton({ rows = 3, className = "" }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-4 bg-gray-800 rounded w-full" />
      ))}
    </div>
  );
}
