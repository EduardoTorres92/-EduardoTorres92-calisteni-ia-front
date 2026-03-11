"use client";

import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import { CircleHelp } from "lucide-react";

interface ExerciseHelpButtonProps {
  exerciseName: string;
}

export function ExerciseHelpButton({ exerciseName }: ExerciseHelpButtonProps) {
  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [, setInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );

  const handleClick = () => {
    setInitialMessage(`Como executar o exercício ${exerciseName} corretamente?`);
    setChatOpen(true);
  };

  return (
    <button onClick={handleClick} className="shrink-0 p-0.5">
      <CircleHelp className="size-5 text-muted-foreground" />
    </button>
  );
}
