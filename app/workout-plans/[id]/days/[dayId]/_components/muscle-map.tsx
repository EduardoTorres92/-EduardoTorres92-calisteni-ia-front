"use client";

const MUSCLE_NAME_TO_IDS: Record<string, string[]> = {
  peito: ["chest"],
  costas: ["back"],
  ombros: ["shoulders-front", "shoulders-back"],
  triceps: ["triceps"],
  biceps: ["biceps"],
  quadriceps: ["quads"],
  posterior: ["hamstrings"],
  gluteos: ["glutes"],
  panturrilha: ["calves-front", "calves-back"],
  abdomen: ["abs"],
  obliquos: ["obliques"],
  lombar: ["lower-back"],
  antebraco: ["forearms-front", "forearms-back"],
  core: ["abs", "obliques", "lower-back"],
};

function getActivePathIds(targetMuscleGroups: string[]): Set<string> {
  const ids = new Set<string>();
  for (const group of targetMuscleGroups) {
    const mapped = MUSCLE_NAME_TO_IDS[group.toLowerCase()];
    if (mapped) {
      for (const id of mapped) ids.add(id);
    }
  }
  return ids;
}

interface MuscleMapProps {
  targetMuscleGroups: string[];
}

export function MuscleMap({ targetMuscleGroups }: MuscleMapProps) {
  if (targetMuscleGroups.length === 0) return null;

  const activeIds = getActivePathIds(targetMuscleGroups);

  const activeFill = "fill-emerald-500/80";
  const inactiveFill = "fill-zinc-700/40";

  function f(id: string) {
    return activeIds.has(id) ? activeFill : inactiveFill;
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
        Músculos trabalhados
      </h3>
      <div className="flex items-center justify-center gap-6">
        {/* Front view */}
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 160 320" className="h-48 w-auto" aria-label="Corpo frente">
            {/* Head */}
            <ellipse cx="80" cy="25" rx="16" ry="20" className="fill-zinc-600/50" />
            {/* Neck */}
            <rect x="72" y="44" width="16" height="12" rx="4" className="fill-zinc-600/50" />

            {/* Shoulders front */}
            <ellipse cx="45" cy="68" rx="14" ry="10" className={`${f("shoulders-front")} transition-colors duration-300`} />
            <ellipse cx="115" cy="68" rx="14" ry="10" className={`${f("shoulders-front")} transition-colors duration-300`} />

            {/* Chest */}
            <path d="M52 62 Q80 58 108 62 Q110 85 80 90 Q50 85 52 62Z" className={`${f("chest")} transition-colors duration-300`} />

            {/* Abs */}
            <rect x="64" y="92" width="32" height="50" rx="6" className={`${f("abs")} transition-colors duration-300`} />

            {/* Obliques */}
            <rect x="52" y="95" width="12" height="44" rx="4" className={`${f("obliques")} transition-colors duration-300`} />
            <rect x="96" y="95" width="12" height="44" rx="4" className={`${f("obliques")} transition-colors duration-300`} />

            {/* Biceps */}
            <ellipse cx="35" cy="105" rx="8" ry="22" className={`${f("biceps")} transition-colors duration-300`} />
            <ellipse cx="125" cy="105" rx="8" ry="22" className={`${f("biceps")} transition-colors duration-300`} />

            {/* Forearms front */}
            <ellipse cx="30" cy="145" rx="6" ry="20" className={`${f("forearms-front")} transition-colors duration-300`} />
            <ellipse cx="130" cy="145" rx="6" ry="20" className={`${f("forearms-front")} transition-colors duration-300`} />

            {/* Quads */}
            <ellipse cx="66" cy="185" rx="14" ry="35" className={`${f("quads")} transition-colors duration-300`} />
            <ellipse cx="94" cy="185" rx="14" ry="35" className={`${f("quads")} transition-colors duration-300`} />

            {/* Calves front */}
            <ellipse cx="64" cy="258" rx="9" ry="28" className={`${f("calves-front")} transition-colors duration-300`} />
            <ellipse cx="96" cy="258" rx="9" ry="28" className={`${f("calves-front")} transition-colors duration-300`} />
          </svg>
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Frente</span>
        </div>

        {/* Back view */}
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 160 320" className="h-48 w-auto" aria-label="Corpo costas">
            {/* Head */}
            <ellipse cx="80" cy="25" rx="16" ry="20" className="fill-zinc-600/50" />
            {/* Neck */}
            <rect x="72" y="44" width="16" height="12" rx="4" className="fill-zinc-600/50" />

            {/* Shoulders back */}
            <ellipse cx="45" cy="68" rx="14" ry="10" className={`${f("shoulders-back")} transition-colors duration-300`} />
            <ellipse cx="115" cy="68" rx="14" ry="10" className={`${f("shoulders-back")} transition-colors duration-300`} />

            {/* Back (upper) */}
            <path d="M52 62 Q80 58 108 62 Q112 100 80 105 Q48 100 52 62Z" className={`${f("back")} transition-colors duration-300`} />

            {/* Lower back */}
            <rect x="62" y="106" width="36" height="32" rx="6" className={`${f("lower-back")} transition-colors duration-300`} />

            {/* Triceps */}
            <ellipse cx="35" cy="100" rx="8" ry="22" className={`${f("triceps")} transition-colors duration-300`} />
            <ellipse cx="125" cy="100" rx="8" ry="22" className={`${f("triceps")} transition-colors duration-300`} />

            {/* Forearms back */}
            <ellipse cx="30" cy="145" rx="6" ry="20" className={`${f("forearms-back")} transition-colors duration-300`} />
            <ellipse cx="130" cy="145" rx="6" ry="20" className={`${f("forearms-back")} transition-colors duration-300`} />

            {/* Glutes */}
            <ellipse cx="68" cy="150" rx="16" ry="12" className={`${f("glutes")} transition-colors duration-300`} />
            <ellipse cx="92" cy="150" rx="16" ry="12" className={`${f("glutes")} transition-colors duration-300`} />

            {/* Hamstrings */}
            <ellipse cx="66" cy="195" rx="14" ry="35" className={`${f("hamstrings")} transition-colors duration-300`} />
            <ellipse cx="94" cy="195" rx="14" ry="35" className={`${f("hamstrings")} transition-colors duration-300`} />

            {/* Calves back */}
            <ellipse cx="64" cy="262" rx="9" ry="28" className={`${f("calves-back")} transition-colors duration-300`} />
            <ellipse cx="96" cy="262" rx="9" ry="28" className={`${f("calves-back")} transition-colors duration-300`} />
          </svg>
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Costas</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {targetMuscleGroups.map((group) => (
          <span
            key={group}
            className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium capitalize text-emerald-400"
          >
            {group}
          </span>
        ))}
      </div>
    </div>
  );
}
