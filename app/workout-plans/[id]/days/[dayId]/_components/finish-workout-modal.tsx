"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ExercisePerformanceItem } from "@/app/_lib/api/adaptive";
import { completeSessionAction } from "../actions";

interface ExerciseRow {
  id: string;
  name: string;
  targetReps: number;
}

interface FinishWorkoutModalProps {
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
  exercises: ExerciseRow[];
  onClose: () => void;
  onSuccess: () => void;
}

export function FinishWorkoutModal({
  workoutPlanId,
  workoutDayId,
  sessionId,
  exercises,
  onClose,
  onSuccess,
}: FinishWorkoutModalProps) {
  const [performance, setPerformance] = useState<ExercisePerformanceItem[]>(
    exercises.map((e) => ({
      workoutExerciseId: e.id,
      targetReps: e.targetReps,
      actualReps: e.targetReps,
      difficulty: 5,
      completed: true,
    })),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (exerciseId: string, field: "actualReps" | "difficulty", value: number) => {
    setPerformance((prev) =>
      prev.map((p) =>
        p.workoutExerciseId === exerciseId ? { ...p, [field]: value } : p,
      ),
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await completeSessionAction(workoutPlanId, workoutDayId, sessionId, performance);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div
        className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-background p-5 shadow-lg sm:max-w-md sm:rounded-2xl"
        role="dialog"
        aria-labelledby="finish-workout-title"
      >
        <h2
          id="finish-workout-title"
          className="font-display text-lg font-semibold text-foreground"
        >
          Como foi o treino?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste reps feitas e dificuldade (RPE 1–10) para progressão automática.
        </p>

        <div className="mt-4 flex flex-1 flex-col gap-4 overflow-y-auto">
          {exercises.map((ex) => {
            const p = performance.find((x) => x.workoutExerciseId === ex.id);
            if (!p) return null;
            return (
              <div
                key={ex.id}
                className="rounded-xl border border-border p-3"
              >
                <p className="font-display text-sm font-semibold text-foreground">
                  {ex.name}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Reps:</span>
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={p.actualReps}
                      onChange={(e) =>
                        update(ex.id, "actualReps", parseInt(e.target.value, 10) || 0)
                      }
                      className="w-16 rounded border border-input bg-background px-2 py-1 text-sm"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">RPE (1–10):</span>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={p.difficulty}
                      onChange={(e) =>
                        update(ex.id, "difficulty", parseInt(e.target.value, 10))
                      }
                      className="w-24"
                    />
                    <span className="text-xs font-medium tabular-nums">{p.difficulty}</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Finalizando..." : "Finalizar treino"}
          </Button>
        </div>
      </div>
    </div>
  );
}
