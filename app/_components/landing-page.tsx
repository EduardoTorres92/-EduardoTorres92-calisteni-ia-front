import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Dumbbell,
  Target,
  Timer,
  BarChart3,
  Brain,
  CheckCircle2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "IA Personal Trainer",
    description:
      "Coach AI cria planos personalizados baseados no seu nivel, equipamentos e objetivos.",
  },
  {
    icon: Dumbbell,
    title: "60+ Exercicios",
    description:
      "Catalogo completo de calistenia por categoria, nivel e grupo muscular.",
  },
  {
    icon: CheckCircle2,
    title: "Tracking por Serie",
    description:
      "Marque cada serie como concluida e acompanhe seu progresso em tempo real.",
  },
  {
    icon: Timer,
    title: "Timer de Descanso",
    description:
      "Cronometro integrado entre series com vibracao ao finalizar.",
  },
  {
    icon: Target,
    title: "Mapa Muscular",
    description:
      "Visualize quais grupos musculares serao trabalhados no dia com silhueta interativa.",
  },
  {
    icon: BarChart3,
    title: "Metricas e Consistencia",
    description:
      "Streak de treinos, taxa de conclusao e historico de aderencia.",
  },
];

const STACK = [
  "Next.js 16",
  "React 19",
  "Tailwind CSS v4",
  "Fastify 5",
  "Prisma 7",
  "OpenAI",
  "PostgreSQL",
  "Better Auth",
  "TypeScript",
];

export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-black text-white">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-12">
        <div className="absolute inset-0 bg-linear-to-b from-[#2b54ff]/20 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          <Image
            src="/fit-ai-logo.svg"
            alt="FIT.AI"
            width={100}
            height={44}
            priority
          />

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
              <Sparkles className="size-4 text-[#2b54ff]" />
              <span className="font-display text-xs font-medium text-white/70">
                Powered by AI
              </span>
            </div>

            <h1 className="max-w-sm font-anton text-[40px] uppercase leading-[1.05] tracking-tight">
              Seu personal trainer de calistenia com IA
            </h1>

            <p className="max-w-xs font-display text-base leading-[1.4] text-white/60">
              Planos personalizados, tracking inteligente e coach disponivel 24h. Tudo focado em treino com peso corporal.
            </p>
          </div>

          <Link
            href="/auth"
            className="flex items-center gap-2 rounded-full bg-[#2b54ff] px-8 py-3.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Comecar agora
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col gap-6 px-5 py-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-display text-xl font-semibold">
            Tudo que voce precisa para treinar
          </h2>
          <p className="font-display text-sm text-white/50">
            Funcionalidades pensadas para calistenia
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#2b54ff]/20">
                <feature.icon className="size-5 text-[#2b54ff]" />
              </div>
              <h3 className="font-display text-sm font-semibold">
                {feature.title}
              </h3>
              <p className="font-display text-xs leading-normal text-white/50">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-6 px-5 py-12">
        <h2 className="text-center font-display text-xl font-semibold">
          Como funciona
        </h2>

        <div className="flex flex-col gap-4">
          {[
            {
              step: "1",
              title: "Faca login",
              desc: "Entre com sua conta Google em segundos.",
            },
            {
              step: "2",
              title: "Converse com a IA",
              desc: "Informe seu nivel, equipamentos e objetivos via chat interativo.",
            },
            {
              step: "3",
              title: "Receba seu plano",
              desc: "A IA monta um plano semanal completo com exercicios do catalogo.",
            },
            {
              step: "4",
              title: "Treine e acompanhe",
              desc: "Marque sets, use o timer e veja seu streak crescer.",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2b54ff] font-display text-sm font-bold">
                {item.step}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-sm font-semibold">
                  {item.title}
                </span>
                <span className="font-display text-xs text-white/50">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="flex flex-col gap-6 px-5 py-12">
        <h2 className="text-center font-display text-xl font-semibold">
          Stack
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-display text-xs text-white/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center gap-6 px-5 py-16">
        <h2 className="text-center font-display text-xl font-semibold">
          Pronto para comecar?
        </h2>
        <Link
          href="/auth"
          className="flex items-center gap-2 rounded-full bg-[#2b54ff] px-8 py-3.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Entrar com Google
        </Link>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-2 border-t border-white/10 px-5 py-8">
        <Image
          src="/fit-ai-logo.svg"
          alt="FIT.AI"
          width={60}
          height={26}
        />
        <p className="font-display text-xs text-white/40">
          2026 Calisteni.IA. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
