"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleSetAction } from "../actions";

interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  completed: boolean;
}

interface SetTrackerProps {
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
  sets: WorkoutSet[];
}

export function SetTracker({
  workoutPlanId,
  workoutDayId,
  sessionId,
  sets,
}: SetTrackerProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (setId: string) => {
    startTransition(() =>
      toggleSetAction(workoutPlanId, workoutDayId, sessionId, setId),
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-display text-xs text-muted-foreground">Sets:</span>
      <div className="flex gap-1.5">
        {sets.map((set) => (
          <button
            key={set.id}
            disabled={isPending}
            onClick={() => handleToggle(set.id)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full border-2 font-display text-xs font-semibold transition-all",
              set.completed
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/50",
              isPending && "opacity-50",
            )}
          >
            {set.completed ? (
              <Check className="size-4" />
            ) : (
              set.setNumber
            )}
          </button>
        ))}
      </div>
      <span className="font-display text-xs text-muted-foreground">
        {sets.filter((s) => s.completed).length}/{sets.length}
      </span>
    </div>
  );
}
