"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

interface RestTimerProps {
  durationInSeconds: number;
  onComplete?: () => void;
}

export function RestTimer({ durationInSeconds, onComplete }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);

          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }

          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  const reset = () => {
    clearTimer();
    setIsRunning(false);
    setTimeLeft(durationInSeconds);
  };

  const togglePlay = () => {
    if (timeLeft === 0) {
      setTimeLeft(durationInSeconds);
    }
    setIsRunning((prev) => !prev);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = durationInSeconds > 0 ? timeLeft / durationInSeconds : 0;

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary transition-colors hover:bg-primary/20"
      >
        <Timer className="size-3.5" />
        <span className="font-display text-xs font-semibold">
          {durationInSeconds}s
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
      <div className="relative flex size-16 items-center justify-center">
        <svg className="-rotate-90" width="64" height="64" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/30"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute font-display text-sm font-semibold tabular-nums text-foreground">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={togglePlay}
          className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {isRunning ? (
            <Pause className="size-3.5" />
          ) : (
            <Play className="size-3.5 translate-x-px" />
          )}
        </button>
        <button
          onClick={reset}
          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
        >
          <RotateCcw className="size-3.5" />
        </button>
        <button
          onClick={() => {
            reset();
            setIsOpen(false);
          }}
          className="flex size-8 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
