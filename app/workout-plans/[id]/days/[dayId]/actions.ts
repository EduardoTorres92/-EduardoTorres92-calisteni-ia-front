"use server";

import { revalidatePath } from "next/cache";
import type { ExercisePerformanceItem } from "@/app/_lib/api/adaptive";
import {
  startWorkoutSession,
  completeWorkoutSession,
  toggleWorkoutSet,
} from "@/app/_lib/api/fetch-generated";

export async function startSessionAction(
  workoutPlanId: string,
  workoutDayId: string,
) {
  await startWorkoutSession(workoutPlanId, workoutDayId);
  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
}

export async function completeSessionAction(
  workoutPlanId: string,
  workoutDayId: string,
  sessionId: string,
  performance?: ExercisePerformanceItem[],
) {
  const body = {
    completedAt: new Date().toISOString(),
    ...(performance?.length ? { performance } : {}),
  };
  await completeWorkoutSession(workoutPlanId, workoutDayId, sessionId, body as Parameters<typeof completeWorkoutSession>[3]);
  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
  revalidatePath("/");
}

export async function toggleSetAction(
  workoutPlanId: string,
  workoutDayId: string,
  sessionId: string,
  setId: string,
) {
  await toggleWorkoutSet(workoutPlanId, workoutDayId, sessionId, setId);
  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
}
