"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startSessionAction, completeSessionAction } from "../actions";

interface WorkoutActionsProps {
  workoutPlanId: string;
  workoutDayId: string;
  activeSessionId: string | null;
  isCompleted: boolean;
  allSetsCompleted?: boolean;
}

export function WorkoutActions({
  workoutPlanId,
  workoutDayId,
  activeSessionId,
  isCompleted,
  allSetsCompleted = false,
}: WorkoutActionsProps) {
  const [isPending, startTransition] = useTransition();

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
      <Button
        variant={allSetsCompleted ? "default" : "outline"}
        className={
          allSetsCompleted
            ? "w-full rounded-full bg-primary py-3 font-display text-sm font-semibold text-primary-foreground"
            : "w-full rounded-full border border-border py-3 font-display text-sm font-semibold text-foreground"
        }
        disabled={isPending}
        onClick={() => {
          startTransition(() =>
            completeSessionAction(workoutPlanId, workoutDayId, activeSessionId),
          );
        }}
      >
        {isPending
          ? "Finalizando..."
          : allSetsCompleted
            ? "Todos os sets concluídos! Finalizar treino"
            : "Marcar como concluído"}
      </Button>
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
