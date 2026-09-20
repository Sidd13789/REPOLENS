export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 border border-dashed border-gray-800 rounded-xl">
      <p className="font-semibold text-lg">{title}</p>
      {description && (
        <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
