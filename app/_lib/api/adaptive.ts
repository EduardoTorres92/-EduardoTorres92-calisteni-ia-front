/**
 * API de treino adaptativo (progressão e histórico).
 * Endpoints: GET /me/progression, GET /me/performance-history.
 */

import { customFetch } from "../fetch";

export interface ExercisePerformanceItem {
  workoutExerciseId: string;
  targetReps: number;
  actualReps: number;
  difficulty: number;
  completed: boolean;
}

export type CompleteWorkoutSessionBodyWithPerformance = {
  completedAt: string;
  performance?: ExercisePerformanceItem[];
};

export interface ProgressionItem {
  exerciseName: string;
  previousTargetReps: number | null;
  previousActualReps: number | null;
  previousDate: string | null;
  lastTargetReps: number;
  lastActualReps: number;
  lastDate: string;
  suggestedReps: number;
  delta: number;
}

export interface ProgressionResponse {
  progressions: ProgressionItem[];
}

export interface PerformanceHistoryPoint {
  date: string;
  exerciseName: string;
  targetReps: number;
  actualReps: number;
  difficulty: number;
  completed: boolean;
}

export interface PerformanceHistoryResponse {
  history: PerformanceHistoryPoint[];
}

export type GetProgressionResponse = { status: number; data: ProgressionResponse; headers: Headers };
export type GetPerformanceHistoryResponse = {
  status: number;
  data: PerformanceHistoryResponse;
  headers: Headers;
};

export const getProgression = async (): Promise<GetProgressionResponse> => {
  return customFetch<GetProgressionResponse>("/me/progression", { method: "GET" });
};

export const getPerformanceHistory = async (params?: {
  from?: string;
  to?: string;
  exerciseName?: string;
  limit?: number;
}): Promise<GetPerformanceHistoryResponse> => {
  const search = new URLSearchParams();
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  if (params?.exerciseName) search.set("exerciseName", params.exerciseName);
  if (params?.limit != null) search.set("limit", String(params.limit));
  const qs = search.toString();
  const url = qs ? `/me/performance-history?${qs}` : "/me/performance-history";
  return customFetch<GetPerformanceHistoryResponse>(url, { method: "GET" });
};
