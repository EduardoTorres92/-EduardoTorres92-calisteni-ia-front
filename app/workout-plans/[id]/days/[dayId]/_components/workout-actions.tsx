"use client";

import { useState } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { startSessionAction, completeSessionAction } from "../actions";
import { FinishWorkoutModal } from "./finish-workout-modal";

interface ExerciseForModal {
  id: string;
  name: string;
  targetReps: number;
}

interface WorkoutActionsProps {
  workoutPlanId: string;
  workoutDayId: string;
  activeSessionId: string | null;
  isCompleted: boolean;
  allSetsCompleted?: boolean;
  exercises?: ExerciseForModal[];
}

export function WorkoutActions({
  workoutPlanId,
  workoutDayId,
  activeSessionId,
  isCompleted,
  allSetsCompleted = false,
  exercises = [],
}: WorkoutActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showFinishModal, setShowFinishModal] = useState(false);
  const router = useRouter();

  const handleFinishModalSuccess = () => {
    setShowFinishModal(false);
    router.refresh();
  };

  if (isCompleted) {
    return (
      <Button
        variant="ghost"
        className="w-full rounded-full border border-border py-3 font-display text-sm font-semibold"
        disabled
      >
        Concluído!
      </Button>
    );
  }

  if (activeSessionId) {
    return (
      <>
        <Button
          variant={allSetsCompleted ? "default" : "outline"}
          className={
            allSetsCompleted
              ? "w-full rounded-full bg-primary py-3 font-display text-sm font-semibold text-primary-foreground"
              : "w-full rounded-full border border-border py-3 font-display text-sm font-semibold text-foreground"
          }
          disabled={isPending}
          onClick={() => {
            if (allSetsCompleted && exercises.length > 0) {
              setShowFinishModal(true);
            } else {
              startTransition(() =>
                completeSessionAction(workoutPlanId, workoutDayId, activeSessionId),
              );
            }
          }}
        >
          {isPending
            ? "Finalizando..."
            : allSetsCompleted
              ? "Todos os sets concluídos! Finalizar treino"
              : "Marcar como concluído"}
        </Button>
        {showFinishModal && (
          <FinishWorkoutModal
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
            sessionId={activeSessionId}
            exercises={exercises}
            onClose={() => setShowFinishModal(false)}
            onSuccess={handleFinishModalSuccess}
          />
        )}
      </>
    );
  }

  return (
    <Button
      className="w-full rounded-full bg-primary py-3 font-display text-sm font-semibold text-primary-foreground"
      disabled={isPending}
      onClick={() => {
        startTransition(() =>
          startSessionAction(workoutPlanId, workoutDayId),
        );
      }}
    >
      {isPending ? "Iniciando..." : "Iniciar Treino"}
    </Button>
  );
}
