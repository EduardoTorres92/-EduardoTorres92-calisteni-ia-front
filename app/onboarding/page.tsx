import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getServerSession } from "@/app/_lib/auth-server";
import { OnboardingChat } from "./_components/onboarding-chat";

export default async function OnboardingPage() {
  const session = await getServerSession();
  if (!session) redirect("/auth");

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full bg-[rgba(43,84,255,0.08)] border border-[rgba(43,84,255,0.08)] p-3">
            <Sparkles className="size-[18px] text-[#2b54ff]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-display text-base font-semibold leading-[1.05] text-black">
              Coach AI
            </span>
            <div className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-[#2b54ff]" />
              <span className="font-display text-xs leading-[1.15] text-[#2b54ff]">
                Online
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="rounded-full bg-[#2b54ff] px-4 py-2 font-display text-sm font-semibold text-white"
        >
          Acessar FIT.AI
        </Link>
      </div>

      {/* Chat */}
      <OnboardingChat />
    </div>
  );
}
