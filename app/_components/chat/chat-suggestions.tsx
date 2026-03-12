"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type SuggestionType = "level" | "equipment" | "objective" | "days" | null;

const LEVEL_OPTIONS = [
  { label: "Iniciante", value: "Iniciante" },
  { label: "Intermediário", value: "Intermediário" },
  { label: "Avançado", value: "Avançado" },
];

const EQUIPMENT_OPTIONS = [
  { label: "Barra fixa", value: "barra_fixa" },
  { label: "Paralelas", value: "paralelas" },
  { label: "Anéis", value: "aneis" },
  { label: "Faixa elástica", value: "faixa_elastica" },
  { label: "Peso extra", value: "peso_extra" },
  { label: "Corda", value: "corda" },
  { label: "Dumbbell", value: "dumbbell" },
  { label: "Nenhum", value: "nenhum" },
];

const OBJECTIVE_OPTIONS = [
  { label: "Força", value: "Força" },
  { label: "Hipertrofia", value: "Hipertrofia" },
  { label: "Skills", value: "Skills" },
  { label: "Resistência", value: "Resistência" },
];

const DAYS_OPTIONS = [
  { label: "2 dias", value: "2" },
  { label: "3 dias", value: "3" },
  { label: "4 dias", value: "4" },
  { label: "5 dias", value: "5" },
  { label: "6 dias", value: "6" },
];

export function detectSuggestionContext(text: string): SuggestionType {
  const lower = text.toLowerCase();
  if ((lower.includes("nível") || lower.includes("nivel")) && lower.includes("?")) return "level";
  if (lower.includes("equipamento") && lower.includes("?")) return "equipment";
  if (lower.includes("objetivo") && lower.includes("?")) return "objective";
  if (lower.includes("dias") && lower.includes("semana") && lower.includes("?")) return "days";
  return null;
}

interface ChatSuggestionsProps {
  suggestionType: SuggestionType;
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatSuggestions({ suggestionType, onSend, disabled }: ChatSuggestionsProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(new Set());

  if (!suggestionType) return null;

  if (suggestionType === "equipment") {
    const toggleEquipment = (value: string) => {
      setSelectedEquipment((prev) => {
        const next = new Set(prev);
        if (value === "nenhum") {
          return next.has("nenhum") ? new Set() : new Set(["nenhum"]);
        }
        next.delete("nenhum");
        if (next.has(value)) {
          next.delete(value);
        } else {
          next.add(value);
        }
        return next;
      });
    };

    const handleConfirm = () => {
      if (selectedEquipment.size === 0) return;
      const labels = EQUIPMENT_OPTIONS
        .filter((o) => selectedEquipment.has(o.value))
        .map((o) => o.label);
      onSend(labels.join(", "));
    };

    return (
      <div className="flex flex-col gap-2 pl-5 pr-15 pb-2">
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => toggleEquipment(opt.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-display text-xs transition-colors",
                selectedEquipment.has(opt.value)
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                  : "border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-zinc-500",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={disabled || selectedEquipment.size === 0}
          onClick={handleConfirm}
          className={cn(
            "w-fit rounded-full px-5 py-2 font-display text-sm font-medium transition-colors",
            selectedEquipment.size > 0 && !disabled
              ? "bg-primary text-primary-foreground"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed",
          )}
        >
          Confirmar
        </button>
      </div>
    );
  }

  const options =
    suggestionType === "level"
      ? LEVEL_OPTIONS
      : suggestionType === "objective"
        ? OBJECTIVE_OPTIONS
        : DAYS_OPTIONS;

  return (
    <div className="flex flex-wrap gap-2 pl-5 pr-15 pb-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onSend(opt.value)}
          className="rounded-full border border-zinc-700 bg-zinc-800/60 px-4 py-2 font-display text-sm text-zinc-300 transition-colors hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
