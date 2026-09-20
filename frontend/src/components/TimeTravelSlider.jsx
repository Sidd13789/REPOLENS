import { useEffect, useRef, useState } from "react";

export default function TimeTravelSlider({ createdAt, onSelect }) {
  const start = createdAt ? new Date(createdAt).getTime() : Date.now() - 1000 * 60 * 60 * 24 * 365;
  const end = Date.now();
  const [value, setValue] = useState(end);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  const dateLabel = new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  // ~30 steps across the repo's lifetime, one step every 400ms while playing.
  const stepSize = Math.max(1, Math.floor((end - start) / 30));

  useEffect(() => {
    if (!playing) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setValue((v) => {
        const next = v + stepSize;
        if (next >= end) {
          clearInterval(intervalRef.current);
          setPlaying(false);
          onSelect(new Date(end).toISOString().slice(0, 10));
          return end;
        }
        onSelect(new Date(next).toISOString().slice(0, 10));
        return next;
      });
    }, 400);
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>{new Date(start).getFullYear()}</span>
        <span className="text-white font-medium">{dateLabel}</span>
        <span>{new Date(end).getFullYear()}</span>
      </div>
      <input
        type="range"
        min={start}
        max={end}
        value={value}
        onChange={(e) => {
          setPlaying(false);
          setValue(Number(e.target.value));
        }}
        className="w-full accent-blue-500"
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onSelect(new Date(value).toISOString().slice(0, 10))}
          className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium"
        >
          View repository state
        </button>
        <button
          onClick={() => {
            if (!playing && value >= end) setValue(start);
            setPlaying((p) => !p);
          }}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 text-sm font-medium"
        >
          {playing ? "⏸ Pause" : "▶ Play Evolution"}
        </button>
      </div>
    </div>
  );
}
