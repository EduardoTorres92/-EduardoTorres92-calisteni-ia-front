import Link from "next/link";
import { Calendar, Timer, Dumbbell } from "lucide-react";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

interface WorkoutDayCardProps {
  id: string;
  workoutPlanId: string;
  name: string;
  weekDay: string;
  estimatedDurationInSeconds: number;
  exercisesCount: number;
  coverImageUrl: string | null;
  isRest: boolean;
}

export function WorkoutDayCard({
  id,
  workoutPlanId,
  name,
  weekDay,
  estimatedDurationInSeconds,
  exercisesCount,
  coverImageUrl,
}: WorkoutDayCardProps) {
  const durationMinutes = Math.round(estimatedDurationInSeconds / 60);

  return (
    <Link href={`/workout-plans/${workoutPlanId}/days/${id}`} className="block">
      <div className="relative flex h-[200px] flex-col items-start justify-between overflow-hidden rounded-xl bg-linear-to-br from-[#2b54ff] to-[#1a3ad4] p-5">
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt={name}
            className="absolute inset-0 size-full object-cover pointer-events-none rounded-xl"
          />
        )}

        <div className="relative z-10 flex items-center">
          <div className="flex items-center gap-1 rounded-full bg-white/16 px-2.5 py-1.5 backdrop-blur-sm">
            <Calendar className="size-3.5 text-white" />
            <span className="font-display text-xs font-semibold uppercase text-white">
              {WEEKDAY_LABELS[weekDay] ?? weekDay}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-2">
          <h3 className="font-display text-2xl font-semibold leading-[1.05] text-white">
            {name}
          </h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <Timer className="size-3.5 text-white/70" />
              <span className="font-display text-xs text-white/70">
                {durationMinutes}min
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="size-3.5 text-white/70" />
              <span className="font-display text-xs text-white/70">
                {exercisesCount} exercício{exercisesCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
