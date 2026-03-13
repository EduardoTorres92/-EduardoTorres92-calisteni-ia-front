import { TrendingUp } from "lucide-react";
import type { PerformanceHistoryPoint } from "@/app/_lib/api/adaptive";

interface PerformanceChartsProps {
  history: PerformanceHistoryPoint[];
}

function groupByExercise(
  history: PerformanceHistoryPoint[],
): Map<string, PerformanceHistoryPoint[]> {
  const map = new Map<string, PerformanceHistoryPoint[]>();
  for (const point of history) {
    const list = map.get(point.exerciseName) ?? [];
    list.push(point);
    map.set(point.exerciseName, list);
  }
  return map;
}

export function PerformanceCharts({ history }: PerformanceChartsProps) {
  if (history.length === 0) {
    return null;
  }

  const byExercise = groupByExercise(history);
  const maxReps = Math.max(
    ...history.map((p) => p.actualReps),
    1,
  );

  return (
    <div className="w-full rounded-xl border border-[rgba(43,84,255,0.2)] bg-[rgba(43,84,255,0.06)] p-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="size-5 text-[#2b54ff]" />
        <h3 className="font-display text-base font-semibold text-black">
          Desempenho
        </h3>
      </div>
      <p className="mt-1 text-xs text-black/60">
        Reps realizados por data (últimos registros).
      </p>
      <div className="mt-3 flex flex-col gap-4">
        {Array.from(byExercise.entries()).map(([exerciseName, points]) => (
          <div key={exerciseName}>
            <p className="mb-2 font-display text-sm font-semibold text-black">
              {exerciseName}
            </p>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {points.slice(-14).map((p, i) => (
                <div
                  key={`${p.date}-${i}`}
                  className="flex min-w-[2.5rem] flex-col items-center gap-0.5"
                  title={`${p.date}: ${p.actualReps} reps (RPE ${p.difficulty})`}
                >
                  <div
                    className="w-full min-h-[2rem] rounded-t bg-[#2b54ff] opacity-80"
                    style={{
                      height: `${Math.max(8, (p.actualReps / maxReps) * 80)}px`,
                    }}
                  />
                  <span className="text-[10px] text-black/60">{p.actualReps}</span>
                  <span className="text-[10px] text-black/40">
                    {p.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
