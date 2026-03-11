import { redirect } from "next/navigation";
import dayjs from "dayjs";
import {
  CircleCheck,
  CirclePercent,
  Hourglass,
  Flame,
} from "lucide-react";
import { getServerSession } from "@/app/_lib/auth-server";
import { getStats } from "@/app/_lib/api/fetch-generated";
import { needsOnboarding } from "@/app/_lib/check-onboarding";
import { Navbar } from "@/app/_components/navbar";
import { cn } from "@/lib/utils";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

interface MonthGroup {
  label: string;
  weeks: { date: string; completed: boolean; started: boolean }[][];
}

function getMondayOfWeek(date: dayjs.Dayjs): dayjs.Dayjs {
  const dow = date.day();
  const diff = dow === 0 ? -6 : 1 - dow;
  return date.add(diff, "day");
}

function buildHeatmapMonths(
  consistencyByDay: Record<
    string,
    { workoutDayCompleted: boolean; workoutDayStarted: boolean }
  >,
): MonthGroup[] {
  const today = dayjs();
  const startOfRange = today.subtract(2, "month").startOf("month");
  const endOfRange = today.endOf("month");

  let cursor = getMondayOfWeek(startOfRange);

  const allWeeks: { weekStart: dayjs.Dayjs; days: { date: string; completed: boolean; started: boolean }[] }[] = [];

  while (cursor.isBefore(endOfRange) || cursor.isSame(endOfRange, "day")) {
    const weekDays: { date: string; completed: boolean; started: boolean }[] = [];

    for (let d = 0; d < 7; d++) {
      const day = cursor.add(d, "day");
      const dateKey = day.format("YYYY-MM-DD");
      const data = consistencyByDay[dateKey];

      weekDays.push({
        date: dateKey,
        completed: data?.workoutDayCompleted ?? false,
        started: data?.workoutDayStarted ?? false,
      });
    }

    allWeeks.push({ weekStart: cursor, days: weekDays });
    cursor = cursor.add(7, "day");
  }

  const months: MonthGroup[] = [];
  const rangeStart = startOfRange.month();
  const rangeStartYear = startOfRange.year();

  for (let i = 0; i < 3; i++) {
    const monthDate = dayjs()
      .year(rangeStartYear)
      .month(rangeStart)
      .add(i, "month");
    const monthIdx = monthDate.month();
    const year = monthDate.year();

    const monthWeeks = allWeeks.filter((w) => {
      const thursday = w.weekStart.add(3, "day");
      return thursday.month() === monthIdx && thursday.year() === year;
    });

    if (monthWeeks.length > 0) {
      months.push({
        label: MONTH_LABELS[monthIdx],
        weeks: monthWeeks.map((w) => w.days),
      });
    }
  }

  return months;
}

function formatTotalTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${String(minutes).padStart(2, "0")}m`;
}

export default async function StatsPage() {
  const session = await getServerSession();
  if (!session) redirect("/auth");
  if (await needsOnboarding()) redirect("/onboarding");

  const today = dayjs();
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.format("YYYY-MM-DD");

  let stats = null;
  try {
    const response = await getStats({ from, to });
    stats = response.status === 200 ? response.data : null;
  } catch {
    stats = null;
  }

  const workoutStreak = stats?.workoutStreak ?? 0;
  const heatmapMonths = stats
    ? buildHeatmapMonths(stats.consistencyByDay)
    : [];

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-24">
      {/* Header */}
      <div className="flex h-14 items-center px-5">
        <p className="font-anton text-[22px] uppercase leading-[1.15] text-black">
          Fit.ai
        </p>
      </div>

      {/* Streak Banner */}
      <div className="px-5">
        <div
          className={cn(
            "relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-xl px-5 py-10",
            workoutStreak > 0
              ? "bg-linear-to-br from-orange-500 via-red-500 to-amber-600"
              : "bg-linear-to-br from-zinc-400 via-zinc-500 to-zinc-600",
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full border border-white/12 bg-white/12 p-3 backdrop-blur-sm">
              <Flame className="size-8 text-white" />
            </div>
            <div className="flex flex-col items-center gap-1 text-white">
              <p className="font-display text-5xl font-semibold leading-[0.95]">
                {workoutStreak} {workoutStreak === 1 ? "dia" : "dias"}
              </p>
              <p className="font-display text-base leading-[1.15] opacity-60">
                Sequência Atual
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="flex flex-col gap-3 p-5">
          {/* Consistency Title */}
          <div className="flex items-center gap-3">
            <h2 className="font-display text-lg font-semibold leading-[1.4] text-foreground">
              Consistência
            </h2>
          </div>

          {/* Heatmap */}
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-border p-5">
            {heatmapMonths.map((month) => (
              <div
                key={month.label}
                className="flex flex-col gap-1.5 items-start justify-center"
              >
                <p className="font-display text-xs leading-[1.4] text-[#656565]">
                  {month.label}
                </p>
                <div className="flex gap-1 items-start">
                  {month.weeks.map((weekDays, weekIdx) => (
                    <div
                      key={weekIdx}
                      className="flex flex-col gap-1 items-start"
                    >
                      {weekDays.map((day) => (
                        <div
                          key={day.date}
                          className={cn(
                            "size-5 rounded-[6px]",
                            day.completed && "bg-[#2b54ff]",
                            !day.completed &&
                              day.started &&
                              "bg-[#d5dffe]",
                            !day.completed &&
                              !day.started &&
                              "border border-border",
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stats Cards Row */}
          <div className="flex gap-3 items-center w-full">
            <div className="flex flex-1 flex-col items-center gap-5 rounded-xl bg-[rgba(43,84,255,0.08)] p-5">
              <div className="flex items-center rounded-full bg-[rgba(43,84,255,0.08)] p-[9px]">
                <CircleCheck className="size-4 text-[#2b54ff]" />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <p className="font-display text-2xl font-semibold leading-[1.15] text-black">
                  {stats.completedWorkoutsCount}
                </p>
                <p className="font-display text-xs leading-[1.4] text-[#656565]">
                  Treinos Feitos
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center gap-5 rounded-xl bg-[rgba(43,84,255,0.08)] p-5">
              <div className="flex items-center rounded-full bg-[rgba(43,84,255,0.08)] p-[9px]">
                <CirclePercent className="size-4 text-[#2b54ff]" />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <p className="font-display text-2xl font-semibold leading-[1.15] text-black">
                  {Math.round(stats.conclusionRate * 100)}%
                </p>
                <p className="font-display text-xs leading-[1.4] text-[#656565]">
                  Taxa de conclusão
                </p>
              </div>
            </div>
          </div>

          {/* Total Time Card */}
          <div className="flex flex-col items-center gap-5 rounded-xl bg-[rgba(43,84,255,0.08)] p-5 w-full">
            <div className="flex items-center rounded-full bg-[rgba(43,84,255,0.08)] p-[9px]">
              <Hourglass className="size-4 text-[#2b54ff]" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-display text-2xl font-semibold leading-[1.15] text-black">
                {formatTotalTime(stats.totalTimeInSeconds)}
              </p>
              <p className="font-display text-xs leading-[1.4] text-[#656565]">
                Tempo Total
              </p>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
