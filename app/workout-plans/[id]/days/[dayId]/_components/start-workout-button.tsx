"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startSessionAction } from "../actions";

interface StartWorkoutButtonProps {
  workoutPlanId: string;
  workoutDayId: string;
}

export function StartWorkoutButton({
  workoutPlanId,
  workoutDayId,
}: StartWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="rounded-full bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground"
      disabled={isPending}
      onClick={() => {
        startTransition(() => startSessionAction(workoutPlanId, workoutDayId));
      }}
    >
      {isPending ? "Iniciando..." : "Iniciar Treino"}
    </Button>
  );
}
