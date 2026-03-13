import Link from "next/link";
import { Flame } from "lucide-react";
import type { ProgressionItem } from "@/app/_lib/api/adaptive";

interface ProgressionPreviewProps {
  progressions: ProgressionItem[];
}

export function ProgressionPreview({ progressions }: ProgressionPreviewProps) {
  if (progressions.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 px-5 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold leading-[1.4] text-foreground">
          Progressão
        </h2>
        <Link
          href="/profile"
          className="font-display text-xs leading-[1.4] text-[#2b54ff]"
        >
          Ver no perfil
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {progressions.slice(0, 4).map((p) => (
          <div
            key={p.exerciseName}
            className="flex items-center gap-2 rounded-xl border border-[#f1f1f1] bg-[#fafafa] px-3 py-2"
          >
            <Flame className="size-4 text-[#2b54ff]" aria-hidden />
            <div>
              <p className="font-display text-sm font-semibold text-foreground">
                {p.exerciseName}
              </p>
              <p className="text-xs text-muted-foreground">
                {p.previousDate ? `${p.lastActualReps} → ${p.suggestedReps} reps` : `${p.suggestedReps} reps`}
                {p.delta !== 0 && (
                  <span className={p.delta > 0 ? " text-green-600" : " text-amber-600"}>
                    {" "}({p.delta > 0 ? `+${p.delta}` : p.delta})
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
