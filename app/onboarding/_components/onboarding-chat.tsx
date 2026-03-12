"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp } from "lucide-react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import {
  ChatSuggestions,
  detectSuggestionContext,
} from "@/app/_components/chat/chat-suggestions";

const WELCOME_MESSAGES = [
  "Bem-vindo ao FIT.AI! \u{1F389}",
  "O app que vai transformar a forma como você treina. Aqui você monta seu plano de treino personalizado, acompanha sua evolução com estatísticas detalhadas e conta com uma IA disponível 24h para te guiar em cada exercício.",
  "Tudo pensado para você alcançar seus objetivos de forma inteligente e consistente.",
  "Vamos configurar seu perfil?",
];

export function OnboardingChat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai",
    }),
  });

  const isStreaming = status === "streaming";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const threshold = 150;
    const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    if (nearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !isStreaming) return;

    const observer = new MutationObserver(() => {
      scrollToBottom("instant");
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [isStreaming, scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <>
      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto pt-5 pb-8"
      >
        {/* Welcome messages */}
        <div className="flex flex-col gap-3 pl-5 pr-15">
          {WELCOME_MESSAGES.map((msg, i) => (
            <div
              key={i}
              className="rounded-xl bg-secondary p-3 self-start"
            >
              <p className="font-display text-sm leading-[1.4] text-foreground">
                {msg}
              </p>
            </div>
          ))}
        </div>

        {/* User and AI messages */}
        {messages.map((message, idx) => {
          if (message.role === "user") {
            const userText =
              message.parts
                ?.filter((p) => p.type === "text")
                .map((p) => p.text)
                .join("") ?? "";

            return (
              <div
                key={message.id}
                className="pl-15 pr-5"
              >
                <div className="rounded-xl bg-primary p-3 self-end ml-auto w-fit">
                  <p className="font-display text-sm leading-[1.4] text-primary-foreground">
                    {userText}
                  </p>
                </div>
              </div>
            );
          }

          const parts =
            message.parts?.filter((p) => p.type === "text") ?? [];
          const textContent = parts.map((p) => p.text).join("");

          if (!textContent) return null;

          const isLastMessage = idx === messages.length - 1;
          const isActivelyStreaming = isStreaming && isLastMessage;

          return (
            <div key={message.id} className="pl-5 pr-15">
              <div className="rounded-xl bg-secondary p-3 self-start w-fit">
                <div className="font-display text-sm leading-[1.4] text-foreground prose prose-sm max-w-none">
                  <Streamdown
                    mode={isActivelyStreaming ? "streaming" : "static"}
                    animated={
                      isActivelyStreaming
                        ? { animation: "fadeIn", duration: 120, sep: "word" }
                        : false
                    }
                    caret={isActivelyStreaming ? "block" : undefined}
                  >
                    {textContent}
                  </Streamdown>
                </div>
              </div>
            </div>
          );
        })}

        {/* Initial suggestion */}
        {messages.length === 0 && (
          <div className="pl-15 pr-5 pt-5">
            <button
              onClick={() => sendMessage({ text: "Começar!" })}
              className="rounded-xl bg-primary p-3 ml-auto block"
            >
              <p className="font-display text-sm leading-[1.4] text-primary-foreground">
                Começar!
              </p>
            </button>
          </div>
        )}

        {/* Contextual suggestion buttons */}
        {(() => {
          const lastAiMsg = [...messages].reverse().find((m) => m.role === "assistant");
          const lastMsg = messages[messages.length - 1];
          if (lastAiMsg && lastMsg?.role === "assistant") {
            const text = lastAiMsg.parts
              ?.filter((p) => p.type === "text")
              .map((p) => p.text)
              .join("") ?? "";
            const suggestionType = detectSuggestionContext(text);
            if (suggestionType) {
              return (
                <ChatSuggestions
                  suggestionType={suggestionType}
                  onSend={(val) => {
                    sendMessage({ text: val });
                  }}
                  disabled={isStreaming}
                />
              );
            }
          }
          return null;
        })()}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-5">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem"
            className="flex-1 rounded-full border border-border bg-secondary px-4 py-3 font-display text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full p-[10px] size-[42px] transition-colors",
              input.trim() && !isStreaming
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            <ArrowUp className="size-5" />
          </button>
        </form>
      </div>
    </>
  );
}
