# Calisteni.IA - Frontend

> Interface mobile-first para treinos de calistenia com IA personal trainer, tracking de series e visualizacao de grupos musculares.

## Visao do Produto

Calisteni.IA e o frontend de uma plataforma de treinos de calistenia que oferece:

- **Onboarding guiado por IA** — Chat interativo com botoes clicaveis para selecao de nivel, equipamentos e objetivos
- **Dashboard inteligente** — Treino do dia, streak de consistencia e acesso rapido ao plano
- **Tracking por serie** — Marcar cada serie como completa durante o treino
- **Timer de descanso** — Cronometro circular entre series com vibracao ao finalizar
- **Mapa muscular** — Silhueta SVG mostrando quais grupos musculares sao trabalhados no dia
- **Coach AI 24h** — Chat com IA para duvidas, ajustes no plano e orientacoes

## Screenshots

> Em breve: GIF/video demonstrando o fluxo completo (login, onboarding, treino, consistencia).

### Fluxo do Usuario

```
Landing Page ──▶ Login (Google) ──▶ Onboarding (Chat IA)
                                          │
                                    ┌─────▼─────┐
                                    │  Dashboard  │
                                    │  (Home)     │
                                    └──┬──────┬──┘
                                       │      │
                              ┌────────▼┐  ┌──▼────────┐
                              │ Treino   │  │ Estatist. │
                              │ do Dia   │  │ e Perfil  │
                              └────┬─────┘  └───────────┘
                                   │
                         ┌─────────▼─────────┐
                         │  Sessao de Treino  │
                         │  (Sets + Timer)    │
                         └───────────────────┘
```

## Stack

| Camada | Tecnologia | Versao |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 16.1 |
| UI | React | 19.2 |
| Estilizacao | Tailwind CSS v4 | 4.0 |
| Componentes | shadcn/ui + Radix UI | - |
| IA Chat | AI SDK (`@ai-sdk/react`) | 6.0 |
| Markdown Streaming | Streamdown | 2.2 |
| Autenticacao | Better Auth (client) | 1.4 |
| API Client | Orval (gerado do OpenAPI) | 8.1 |
| URL State | nuqs | 2.8 |
| Icones | Lucide React | - |
| Fontes | Inter, Inter Tight, Anton | - |
| Linguagem | TypeScript | 5.x |

## Arquitetura

```
app/
├── _components/          # Componentes compartilhados
│   ├── chat/             # Chatbot + ChatSuggestions
│   ├── navbar.tsx         # Navegacao inferior
│   ├── consistency-tracker.tsx
│   └── workout-day-card.tsx
├── _lib/
│   ├── api/fetch-generated/  # API client gerado pelo Orval
│   ├── auth-client.ts        # Better Auth (client-side)
│   ├── auth-server.ts        # Better Auth (server-side)
│   └── fetch.ts              # Fetch customizado com cookies
├── api/                  # Route handlers (proxy)
│   ├── ai/route.ts       # Proxy streaming para /ai
│   └── auth/[...all]/    # Proxy para Better Auth
├── auth/                 # Tela de login
├── onboarding/           # Onboarding com chat IA
├── profile/              # Perfil do usuario
├── stats/                # Estatisticas e metricas
└── workout-plans/        # Planos e sessoes de treino
    └── [id]/days/[dayId]/
        └── _components/
            ├── muscle-map.tsx      # SVG corpo humano
            ├── rest-timer.tsx      # Timer de descanso
            ├── set-tracker.tsx     # Tracking por serie
            └── workout-actions.tsx # Acoes de sessao
```

### Padroes

- **Server Components** por padrao, `"use client"` apenas quando necessario
- **Server Actions** para mutacoes (iniciar sessao, completar set, concluir treino)
- **API Proxy** — chamadas ao backend passam por route handlers do Next.js para manter cookies no mesmo dominio
- **Orval** — API client tipado gerado automaticamente a partir do Swagger/OpenAPI do backend

## Paginas

| Rota | Descricao |
|------|-----------|
| `/` | Dashboard — treino do dia, consistencia, streak |
| `/auth` | Login com Google |
| `/onboarding` | Chat com IA para coletar dados e criar primeiro plano |
| `/profile` | Dados do usuario e logout |
| `/stats` | Estatisticas (streak, taxa conclusao, tempo total) |
| `/workout-plans/:id` | Detalhes do plano semanal (7 dias) |
| `/workout-plans/:id/days/:dayId` | Dia de treino com exercicios, mapa muscular, timer e sets |

## Instalacao

```bash
git clone https://github.com/EduardoTorres92/-EduardoTorres92-calisteni-ia-front.git
cd calisteni-ia-front

pnpm install

cp .env.example .env.local
```

### Variaveis de Ambiente

| Variavel | Descricao |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL do backend (`http://localhost:3000`) |
| `BETTER_AUTH_URL` | URL do backend para auth (`http://localhost:3000`) |

### Executando

```bash
# Desenvolvimento (porta 3001)
pnpm dev

# Build
pnpm build

# Regenerar API client (requer backend rodando)
npx orval
```

## Funcionalidades

### Coach AI (Chat)
- Chat com streaming de texto
- Onboarding step-by-step com botoes clicaveis
- Criacao automatica de plano de treino personalizado
- Disponivel em qualquer tela via chatbot flutuante

### Mapa Muscular
- SVG inline do corpo humano (frente + costas)
- Grupos musculares do dia destacados em verde
- Legenda com nomes dos musculos

### Timer de Descanso
- Cronometro circular com animacao SVG
- Play/pause/reset
- Vibracao ao finalizar (dispositivos moveis)

### Tracking por Serie
- Circulos clicaveis para cada serie
- Toggle completo/incompleto via server action
- Botao "Concluir treino" habilitado quando todos os sets estao completos

### Consistencia
- Tracker visual de 7 dias com cores por status
- Streak de treinos consecutivos
- Historico detalhado na pagina de estatisticas

## Proximos Passos

- [ ] Landing page publica com hero, features e CTA
- [ ] Historico de evolucao (progressao de reps ao longo do tempo)
- [ ] Graficos de aderencia com metricas mais explicitas
- [ ] Video/GIF no README demonstrando o fluxo
- [ ] PWA com suporte offline
- [ ] Animacoes de transicao entre paginas

## Licenca

ISC
