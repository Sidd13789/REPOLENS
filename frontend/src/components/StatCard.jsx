export default function StatCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 transition">
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {label}
      </p>

      <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}