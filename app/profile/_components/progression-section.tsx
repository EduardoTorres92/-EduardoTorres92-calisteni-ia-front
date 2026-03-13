import { Flame } from "lucide-react";
import type { ProgressionItem } from "@/app/_lib/api/adaptive";

interface ProgressionSectionProps {
  progressions: ProgressionItem[];
}

export function ProgressionSection({ progressions }: ProgressionSectionProps) {
  if (progressions.length === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-xl border border-[rgba(43,84,255,0.2)] bg-[rgba(43,84,255,0.06)] p-4">
      <div className="flex items-center gap-2">
        <Flame className="size-5 text-[#2b54ff]" />
        <h3 className="font-display text-base font-semibold text-black">
          Progressão
        </h3>
      </div>
      <p className="mt-1 text-xs text-black/60">
        Sugestão de reps para o próximo treino com base no seu desempenho.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {progressions.map((p) => (
          <li
            key={p.exerciseName}
            className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2"
          >
            <div>
              <p className="font-display text-sm font-semibold text-black">
                {p.exerciseName}
              </p>
              <p className="text-xs text-black/60">
                {p.previousDate
                  ? `Última vez: ${p.lastActualReps} reps (${p.lastDate})`
                  : `Hoje: ${p.lastActualReps} reps`}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-sm font-semibold text-[#2b54ff]">
                {p.suggestedReps} reps
              </p>
              {p.delta !== 0 && (
                <p
                  className={`text-xs font-medium ${
                    p.delta > 0 ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {p.delta > 0 ? `+${p.delta}` : p.delta}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
