const COLORS = [
  "bg-yellow-400",
  "bg-blue-500",
  "bg-orange-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
];

export default function LanguageBar({ languages }) {
  const entries = Object.entries(languages || {}).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return <p className="text-gray-500 text-sm">No language data.</p>;

  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden">
        {entries.map(([lang, pct], i) => (
          <div
            key={lang}
            className={COLORS[i % COLORS.length]}
            style={{ width: `${pct}%` }}
            title={`${lang} ${pct}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-300">
        {entries.map(([lang, pct], i) => (
          <span key={lang} className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full inline-block ${COLORS[i % COLORS.length]}`}
            />
            {lang} {pct}%
          </span>
        ))}
      </div>
    </div>
  );
}
