"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  House,
  Calendar,
  Sparkles,
  ChartNoAxesColumn,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  todayWorkoutHref?: string;
}

export function Navbar({ todayWorkoutHref }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: House, label: "Home" },
    { href: todayWorkoutHref ?? "#", icon: Calendar, label: "Agenda", matchPrefix: "/workout-plans" },
    { href: "#", icon: Sparkles, label: "AI", featured: true },
    { href: "#", icon: ChartNoAxesColumn, label: "Stats" },
    { href: "#", icon: UserRound, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 py-4">
      {navItems.map((item) => {
        const isActive = item.matchPrefix
          ? pathname.startsWith(item.matchPrefix)
          : item.href === pathname;
        const Icon = item.icon;

        if (item.featured) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-center rounded-full bg-primary p-4"
            >
              <Icon className="size-6 text-primary-foreground" />
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center p-3",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-6" />
          </Link>
        );
      })}
    </nav>
  );
}
