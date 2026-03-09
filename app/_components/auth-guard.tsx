"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/app/_lib/auth-client";

type AuthGuardProps = {
  children: React.ReactNode;
  mode: "authenticated" | "guest";
};

export function AuthGuard({ children, mode }: AuthGuardProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (mode === "authenticated" && !session) {
      router.replace("/auth");
    }

    if (mode === "guest" && session) {
      router.replace("/");
    }
  }, [session, isPending, mode, router]);

  if (isPending) return null;

  if (mode === "authenticated" && !session) return null;
  if (mode === "guest" && session) return null;

  return <>{children}</>;
}
