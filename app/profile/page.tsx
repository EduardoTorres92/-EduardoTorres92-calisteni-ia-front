import { redirect } from "next/navigation";
import Image from "next/image";
import { Weight, Ruler, Scale, User } from "lucide-react";
import { getServerSession } from "@/app/_lib/auth-server";
import { getProgression, getPerformanceHistory } from "@/app/_lib/api/adaptive";
import { getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { needsOnboarding } from "@/app/_lib/check-onboarding";
import { Navbar } from "@/app/_components/navbar";
import { SignOutButton } from "./_components/sign-out-button";
import { ProgressionSection } from "./_components/progression-section";
import { PerformanceCharts } from "./_components/performance-charts";

export default async function ProfilePage() {
  let session: Awaited<ReturnType<typeof getServerSession>> = null;
  try {
    session = await getServerSession();
  } catch {
    session = null;
  }
  if (!session) redirect("/auth");

  let needsOnboardingResult = true;
  try {
    needsOnboardingResult = await needsOnboarding();
  } catch {
    needsOnboardingResult = true;
  }
  if (needsOnboardingResult) redirect("/onboarding");

  let trainData = null;
  try {
    const response = await getUserTrainData();
    trainData = response.status === 200 ? response.data : null;
  } catch {
    trainData = null;
  }

  let progressionData: Awaited<ReturnType<typeof getProgression>>["data"] = { progressions: [] };
  let performanceHistory: Awaited<ReturnType<typeof getPerformanceHistory>>["data"] = { history: [] };
  try {
    const [progRes, histRes] = await Promise.all([
      getProgression(),
      getPerformanceHistory({ limit: 50 }),
    ]);
    if (progRes.status === 200) progressionData = progRes.data;
    if (histRes.status === 200) performanceHistory = histRes.data;
  } catch {
    // keep defaults
  }

  const weightKg = trainData
    ? (trainData.weightInGrams / 1000).toFixed(1)
    : "—";
  const heightCm = trainData ? trainData.heightInCentimeters : "—";
  const age = trainData ? trainData.age : "—";
  const imcDisplay = trainData?.weightInGrams && trainData?.heightInCentimeters
    ? (trainData.weightInGrams / 1000 / Math.pow(trainData.heightInCentimeters / 100, 2)).toFixed(1)
    : "—";

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-24">
      {/* Header */}
      <div className="flex h-14 items-center px-5">
        <p className="font-anton text-[22px] uppercase leading-[1.15] text-black">
          Fit.ai
        </p>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col items-center gap-5 p-5">
        {/* User Info Row */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? ""}
                width={52}
                height={52}
                className="size-[52px] shrink-0 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[rgba(43,84,255,0.08)]">
                <User className="size-6 text-[#2b54ff]" />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <p className="font-display text-lg font-semibold leading-[1.05] text-black">
                {session.user.name ?? "Usuário"}
              </p>
              <p className="font-display text-sm leading-[1.15] text-black/70">
                Plano Básico
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-5 rounded-xl bg-[rgba(43,84,255,0.08)] p-5">
            <div className="flex items-center rounded-full bg-[rgba(43,84,255,0.08)] p-[9px]">
              <Weight className="size-4 text-[#2b54ff]" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-display text-2xl font-semibold leading-[1.15] text-black">
                {weightKg}
              </p>
              <p className="font-display text-xs uppercase leading-[1.4] text-[#656565]">
                Kg
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-[rgba(43,84,255,0.08)] p-5">
            <div className="flex items-center rounded-full bg-[rgba(43,84,255,0.08)] p-[9px]">
              <Ruler className="size-4 text-[#2b54ff]" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-display text-2xl font-semibold leading-[1.15] text-black">
                {heightCm}
              </p>
              <p className="font-display text-xs uppercase leading-[1.4] text-[#656565]">
                Cm
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-[rgba(43,84,255,0.08)] p-5">
            <div className="flex items-center rounded-full bg-[rgba(43,84,255,0.08)] p-[9px]">
              <Scale className="size-4 text-[#2b54ff]" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-display text-2xl font-semibold leading-[1.15] text-black">
                {imcDisplay}
              </p>
              <p className="font-display text-xs uppercase leading-[1.4] text-[#656565]">
                IMC
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-[rgba(43,84,255,0.08)] p-5">
            <div className="flex items-center rounded-full bg-[rgba(43,84,255,0.08)] p-[9px]">
              <User className="size-4 text-[#2b54ff]" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-display text-2xl font-semibold leading-[1.15] text-black">
                {age}
              </p>
              <p className="font-display text-xs uppercase leading-[1.4] text-[#656565]">
                Anos
              </p>
            </div>
          </div>
        </div>

        {/* Progressão */}
        <ProgressionSection progressions={progressionData.progressions} />

        {/* Gráficos de desempenho */}
        <PerformanceCharts history={performanceHistory.history} />

        {/* Sign Out */}
        <SignOutButton />
      </div>

      <Navbar />
    </div>
  );
}
