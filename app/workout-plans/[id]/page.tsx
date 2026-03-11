import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Goal, Calendar, Timer, Dumbbell, Zap } from "lucide-react";
import { getServerSession } from "@/app/_lib/auth-server";
import { getWorkoutPlanById } from "@/app/_lib/api/fetch-generated";
import { needsOnboarding } from "@/app/_lib/check-onboarding";
import { Navbar } from "@/app/_components/navbar";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

const WEEKDAY_ORDER: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkoutPlanPage({ params }: PageProps) {
  const session = await getServerSession();
  if (!session) redirect("/auth");
  if (await needsOnboarding()) redirect("/onboarding");

  const { id } = await params;

  const response = await getWorkoutPlanById(id);
  if (response.status !== 200) redirect("/");

  const plan = response.data;
  const sortedDays = [...plan.workoutDays].sort(
    (a, b) => (WEEKDAY_ORDER[a.weekDay] ?? 0) - (WEEKDAY_ORDER[b.weekDay] ?? 0),
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-24">
      <div className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
        <div className="absolute inset-0 overflow-hidden rounded-b-[20px]">
          <Image
            src="/home-banner.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            aria-hidden
          />
        </div>
        <div
          className="absolute inset-0 rounded-b-[20px]"
          style={{
            backgroundImage:
              "linear-gradient(238deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        <p className="relative z-10 font-anton text-[22px] uppercase leading-[1.15] text-primary-foreground">
          Fit.ai
        </p>

        <div className="relative z-10 flex w-full items-end justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1.5">
              <Goal className="size-4 text-primary-foreground" />
              <span className="font-display text-xs font-semibold uppercase text-primary-foreground">
                {plan.name}
              </span>
            </div>
            <h1 className="font-display text-2xl font-semibold leading-[1.05] text-primary-foreground">
              Plano de Treino
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        {sortedDays.map((day) => {
          if (day.isRest) {
            return (
              <div
                key={day.id}
                className="flex h-[110px] flex-col items-start justify-between rounded-xl bg-secondary p-5"
              >
                <div className="flex items-center">
                  <div className="flex items-center gap-1 rounded-full bg-foreground/8 px-2.5 py-1.5 backdrop-blur-sm">
                    <Calendar className="size-3.5 text-foreground" />
                    <span className="font-display text-xs font-semibold uppercase text-foreground">
                      {WEEKDAY_LABELS[day.weekDay] ?? day.weekDay}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-foreground" />
                  <span className="font-display text-2xl font-semibold leading-[1.05] text-foreground">
                    Descanso
                  </span>
                </div>
              </div>
            );
          }

          const durationMinutes = Math.round(day.estimatedDurationInSeconds / 60);

          return (
            <Link
              key={day.id}
              href={`/workout-plans/${plan.id}/days/${day.id}`}
              className="block"
            >
              <div className="relative flex h-[200px] flex-col items-start justify-between overflow-hidden rounded-xl p-5">
                {day.coverImageUrl ? (
                  <Image
                    src={day.coverImageUrl}
                    alt={day.name}
                    fill
                    unoptimized
                    className="object-cover pointer-events-none rounded-xl"
                  />
                ) : (
                  <div className="absolute inset-0 rounded-xl bg-primary" />
                )}

                <div className="relative z-10 flex items-center">
                  <div className="flex items-center gap-1 rounded-full bg-primary-foreground/16 px-2.5 py-1.5 backdrop-blur-sm">
                    <Calendar className="size-3.5 text-primary-foreground" />
                    <span className="font-display text-xs font-semibold uppercase text-primary-foreground">
                      {WEEKDAY_LABELS[day.weekDay] ?? day.weekDay}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col gap-2">
                  <h3 className="font-display text-2xl font-semibold leading-[1.05] text-primary-foreground">
                    {day.name}
                  </h3>
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
                        {day.exercisesCount} exercício{day.exercisesCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Navbar />
    </div>
  );
}
