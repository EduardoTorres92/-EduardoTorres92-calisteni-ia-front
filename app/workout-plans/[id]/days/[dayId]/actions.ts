"use server";

import { revalidatePath } from "next/cache";
import {
  startWorkoutSession,
  completeWorkoutSession,
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
) {
  await completeWorkoutSession(workoutPlanId, workoutDayId, sessionId, {
    completedAt: new Date().toISOString(),
  });
  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
}
