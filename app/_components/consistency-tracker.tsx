import { cn } from "@/lib/utils";

const WEEKDAY_SHORT_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

interface ConsistencyDay {
  workoutDayCompleted: boolean;
  workoutDayStarted: boolean;
}

interface ConsistencyTrackerProps {
  consistencyByDay: Record<string, ConsistencyDay>;
  workoutStreak: number;
  todayDate: string;
}

export function ConsistencyTracker({
  consistencyByDay,
  workoutStreak,
  todayDate,
}: ConsistencyTrackerProps) {
  const sortedKeys = Object.keys(consistencyByDay).sort();

  const days = sortedKeys.map((dateKey, i) => {
    const consistency = consistencyByDay[dateKey];

    return {
      label: WEEKDAY_SHORT_LABELS[i],
      dateKey,
      isToday: dateKey === todayDate,
      completed: consistency?.workoutDayCompleted ?? false,
      started: consistency?.workoutDayStarted ?? false,
    };
  });

  return (
    <div className="flex gap-3 items-center w-full">
      <div className="flex items-center justify-between rounded-xl border border-[#f1f1f1] p-5 flex-1">
        {days.map((day) => (
          <div key={day.dateKey} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "size-5 rounded-[6px]",
                day.completed && "bg-[#2b54ff]",
                !day.completed && day.started && "bg-[#d5dffe]",
                !day.completed && !day.started && !day.isToday && "border border-[#f1f1f1]",
                !day.completed && !day.started && day.isToday && "border-[1.6px] border-[#2b54ff]"
              )}
            />
            <span className="font-display text-xs leading-[1.4] text-[#656565]">
              {day.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 self-stretch rounded-xl bg-[rgba(240,97,0,0.08)] px-5 py-2">
        <span className="text-base">🔥</span>
        <span className="font-display text-base font-semibold text-black">
          {workoutStreak}
        </span>
      </div>
    </div>
  );
}
