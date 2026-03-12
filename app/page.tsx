import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { getServerSession } from "@/app/_lib/auth-server";
import { getHomeData, getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { Navbar } from "@/app/_components/navbar";
import { ConsistencyTracker } from "@/app/_components/consistency-tracker";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";

export default async function Home() {
  const session = await getServerSession();

  if (!session) redirect("/auth");

  const todayDate = dayjs().format("YYYY-MM-DD");

  let homeData = null;
  let trainData = null;
  try {
    const [homeResponse, trainResponse] = await Promise.all([
      getHomeData(todayDate),
      getUserTrainData(),
    ]);
    homeData = homeResponse.status === 200 ? homeResponse.data : null;
    trainData = trainResponse.status === 200 ? trainResponse.data : null;
  } catch {
    homeData = null;
    trainData = null;
  }

  if (!homeData || !trainData) redirect("/onboarding");

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-24">
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
              "linear-gradient(242deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)",
          }}
        />

        <p className="relative z-10 font-anton text-[22px] uppercase leading-[1.15] text-white">
          Fit.ai
        </p>

        <div className="relative z-10 flex w-full items-end justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-2xl font-semibold leading-[1.05] text-white">
              Olá, {session.user.name?.split(" ")[0] ?? ""}
            </h1>
            <p className="font-display text-sm leading-[1.15] text-white/70">
              Bora treinar hoje?
            </p>
          </div>

          <button className="rounded-full bg-[#2b54ff] px-4 py-2">
            <span className="font-display text-sm font-semibold text-white">
              Bora!
            </span>
          </button>
        </div>
      </div>

      {homeData && (
        <>
          <section className="flex flex-col gap-3 px-5 pt-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold leading-[1.4] text-foreground">
                Consistência
              </h2>
              <Link href="/stats" className="font-display text-xs leading-[1.4] text-[#2b54ff]">
                Ver histórico
              </Link>
            </div>

            <ConsistencyTracker
              consistencyByDay={homeData.consistencyByDay}
              workoutStreak={homeData.workoutStreak}
              todayDate={todayDate}
            />
          </section>

          <section className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold leading-[1.4] text-foreground">
                Treino de Hoje
              </h2>
              <Link href={`/workout-plans/${homeData.activeWorkoutPlanId}`} className="font-display text-xs leading-[1.4] text-[#2b54ff]">
                Ver treinos
              </Link>
            </div>

            {homeData.todayWorkoutDay ? (
              <WorkoutDayCard {...homeData.todayWorkoutDay} />
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#f1f1f1]">
                <p className="font-display text-sm text-[#656565]">
                  Nenhum treino programado para hoje
                </p>
              </div>
            )}
          </section>
        </>
      )}

      <Navbar
        todayWorkoutHref={
          homeData?.todayWorkoutDay
            ? `/workout-plans/${homeData.todayWorkoutDay.workoutPlanId}/days/${homeData.todayWorkoutDay.id}`
            : undefined
        }
      />
    </div>
  );
}
