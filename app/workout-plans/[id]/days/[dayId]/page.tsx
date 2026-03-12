import { redirect } from "next/navigation";
import Image from "next/image";
import { Calendar, Timer, Dumbbell, Zap } from "lucide-react";
import { getServerSession } from "@/app/_lib/auth-server";
import { getWorkoutDayById } from "@/app/_lib/api/fetch-generated";
import { needsOnboarding } from "@/app/_lib/check-onboarding";
import { Navbar } from "@/app/_components/navbar";
import { BackButton } from "./_components/back-button";
import { ExerciseHelpButton } from "./_components/exercise-help-button";
import { RestTimer } from "./_components/rest-timer";
import { SetTracker } from "./_components/set-tracker";
import { StartWorkoutButton } from "./_components/start-workout-button";
import { WorkoutActions } from "./_components/workout-actions";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const WEEKDAY_LABELS_UPPER: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

interface PageProps {
  params: Promise<{ id: string; dayId: string }>;
}

export default async function WorkoutDayPage({ params }: PageProps) {
  const session = await getServerSession();
  if (!session) redirect("/auth");
  if (await needsOnboarding()) redirect("/onboarding");

  const { id: workoutPlanId, dayId: workoutDayId } = await params;

  const response = await getWorkoutDayById(workoutPlanId, workoutDayId);
  if (response.status !== 200) redirect("/");

  const workoutDay = response.data;
  const durationMinutes = Math.round(workoutDay.estimatedDurationInSeconds / 60);

  const activeSession = workoutDay.sessions.find((s) => !s.completedAt);
  const completedSession = workoutDay.sessions.find((s) => s.completedAt);
  const isCompleted = !!completedSession;
  const hasActiveSession = !!activeSession;

  const activeSessionSets = activeSession?.workoutSets ?? [];
  const allSetsCompleted =
    hasActiveSession &&
    activeSessionSets.length > 0 &&
    activeSessionSets.every((s) => s.completed);

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-24">
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between">
          <BackButton />
          <h1 className="font-display text-lg font-semibold leading-[1.4] text-foreground">
            {hasActiveSession ? "Treino de Hoje" : WEEKDAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay}
          </h1>
          <div className="size-6" />
        </div>

        <div className="relative flex h-[200px] flex-col items-start justify-between overflow-hidden rounded-xl p-5">
          {workoutDay.coverImageUrl ? (
            <Image
              src={workoutDay.coverImageUrl}
              alt={workoutDay.name}
              fill
              unoptimized
              className="object-cover pointer-events-none rounded-xl"
            />
          ) : (
            <div className="absolute inset-0 rounded-xl bg-primary" />
          )}

          <div className="relative z-10 flex items-center">
            <div className="flex items-center gap-1 rounded-full bg-background/16 px-2.5 py-1.5 backdrop-blur-sm">
              <Calendar className="size-3.5 text-primary-foreground" />
              <span className="font-display text-xs font-semibold uppercase text-primary-foreground">
                {WEEKDAY_LABELS_UPPER[workoutDay.weekDay] ?? workoutDay.weekDay}
              </span>
            </div>
          </div>

          <div className="relative z-10 flex w-full items-end justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-2xl font-semibold leading-[1.05] text-primary-foreground">
                {workoutDay.name}
              </h2>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <Timer className="size-3.5 text-primary-foreground/70" />
                  <span className="font-display text-xs text-primary-foreground/70">
                    {durationMinutes}min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="size-3.5 text-primary-foreground/70" />
                  <span className="font-display text-xs text-primary-foreground/70">
                    {workoutDay.exercises.length} exercício{workoutDay.exercises.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {!hasActiveSession && !isCompleted && (
              <StartWorkoutButton
                workoutPlanId={workoutPlanId}
                workoutDayId={workoutDayId}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {workoutDay.exercises
            .sort((a, b) => a.order - b.order)
            .map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-start justify-between rounded-xl border border-border p-4"
              >
                <div className="flex flex-1 flex-col gap-3 justify-center">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-display text-base font-semibold leading-[1.4] text-foreground">
                      {exercise.name}
                    </span>
                    <ExerciseHelpButton exerciseName={exercise.name} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-secondary px-2.5 py-1.5 font-display text-xs font-semibold uppercase text-muted-foreground">
                      {exercise.sets} séries
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-1.5 font-display text-xs font-semibold uppercase text-muted-foreground">
                      {exercise.reps} reps
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1.5 font-display text-xs font-semibold uppercase text-muted-foreground">
                      <Zap className="size-3.5" />
                      {exercise.restTimeInSeconds}S
                    </span>
                  </div>
                  {hasActiveSession && activeSession && (
                    <>
                      <SetTracker
                        workoutPlanId={workoutPlanId}
                        workoutDayId={workoutDayId}
                        sessionId={activeSession.id}
                        sets={activeSessionSets
                          .filter((s) => s.exerciseId === exercise.id)
                          .map((s) => ({
                            id: s.id,
                            exerciseId: s.exerciseId,
                            setNumber: s.setNumber,
                            completed: s.completed,
                          }))}
                      />
                      <RestTimer durationInSeconds={exercise.restTimeInSeconds} />
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>

        {(hasActiveSession || isCompleted) && (
          <WorkoutActions
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
            activeSessionId={activeSession?.id ?? null}
            isCompleted={isCompleted}
            allSetsCompleted={allSetsCompleted}
          />
        )}
      </div>

      <Navbar />
    </div>
  );
}
