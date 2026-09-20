const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function intensity(count, max) {
  if (!count) return "bg-gray-800";
  const ratio = count / max;
  if (ratio > 0.75) return "bg-green-400";
  if (ratio > 0.5) return "bg-green-500/70";
  if (ratio > 0.25) return "bg-green-600/50";
  return "bg-green-800/50";
}

export default function Heatmap({ grid }) {
  if (!grid) return null;
  const max = Math.max(1, ...grid.flat());

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid grid-cols-[auto_repeat(24,1fr)] gap-1 text-xs text-gray-400">
        <div />
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="text-center w-4">
            {h % 6 === 0 ? h : ""}
          </div>
        ))}
        {grid.map((row, dayIdx) => (
          <>
            <div key={`label-${dayIdx}`} className="pr-2 flex items-center">
              {DAYS[dayIdx]}
            </div>
            {row.map((count, hourIdx) => (
              <div
                key={`${dayIdx}-${hourIdx}`}
                title={`${DAYS[dayIdx]} ${hourIdx}:00 — ${count} commits`}
                className={`w-4 h-4 rounded-sm ${intensity(count, max)}`}
              />
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
