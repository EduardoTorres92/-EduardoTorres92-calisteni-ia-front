"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { ChatSuggestions, detectSuggestionContext } from "./chat-suggestions";

const SUGGESTIONS = ["Monte meu plano de treino"];

export function Chatbot() {
  const [chatOpen, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [initialMessage, setInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );

  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai",
    }),
  });

  const isStreaming = status === "streaming";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (chatOpen && initialMessage && !initialMessageSent.current) {
      initialMessageSent.current = true;
      const msg = initialMessage;
      setInitialMessage(null);
      sendMessage({ text: msg });
    }
  }, [chatOpen, initialMessage, setInitialMessage, sendMessage]);

  useEffect(() => {
    if (!chatOpen) {
      initialMessageSent.current = false;
    }
  }, [chatOpen]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !isStreaming) return;

    const observer = new MutationObserver(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [isStreaming]);

  const handleClose = () => {
    setChatOpen(null);
    setInitialMessage(null);
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  };

  if (!chatOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full bg-primary p-2.5">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-semibold text-foreground">
              Coach AI
            </span>
            <span className="flex items-center gap-1 font-display text-xs text-[#22c55e]">
              <span className="size-1.5 rounded-full bg-[#22c55e]" />
              Online
            </span>
          </div>
        </div>
        <button onClick={handleClose} className="p-1">
          <X className="size-6 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 pt-4 pb-8">
        {messages.length === 0 && (
          <div className="rounded-xl bg-secondary px-4 py-3 self-start max-w-[85%]">
            <p className="font-display text-sm text-foreground">
              Olá! Sou sua IA personal. Como posso ajudar com seu treino hoje?
            </p>
          </div>
        )}

        {messages.map((message, idx) => {
          if (message.role === "user") {
            const userText = message.parts
              ?.filter((p) => p.type === "text")
              .map((p) => p.text)
              .join("") ?? "";

            return (
              <div
                key={message.id}
                className="rounded-xl bg-primary px-4 py-3 self-end max-w-[85%]"
              >
                <p className="font-display text-sm text-primary-foreground">
                  {userText}
                </p>
              </div>
            );
          }

          const parts = message.parts?.filter((p) => p.type === "text") ?? [];
          const textContent = parts.map((p) => p.text).join("");

          if (!textContent) return null;

          const isLastMessage = idx === messages.length - 1;
          const isActivelyStreaming = isStreaming && isLastMessage;

          return (
            <div
              key={message.id}
              className="rounded-xl bg-secondary px-4 py-3 self-start max-w-[85%]"
            >
              <div className="font-display text-sm text-foreground prose prose-sm max-w-none">
                <Streamdown
                  mode={isActivelyStreaming ? "streaming" : "static"}
                  animated={isActivelyStreaming ? { animation: "fadeIn", duration: 120, sep: "word" } : false}
                  caret={isActivelyStreaming ? "block" : undefined}
                >
                  {textContent}
                </Streamdown>
              </div>
            </div>
          );
        })}
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
                  onSend={(val) => sendMessage({ text: val })}
                  disabled={isStreaming}
                />
              );
            }
          }
          return null;
        })()}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="flex gap-2 overflow-x-auto px-5 pb-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestion(suggestion)}
              className="shrink-0 rounded-full border border-border px-4 py-2 font-display text-sm text-foreground transition-colors hover:bg-secondary"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-3 border-t border-border px-5 py-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 items-center gap-3"
        >
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
              "flex shrink-0 items-center justify-center rounded-full p-3 transition-colors",
              input.trim() && !isStreaming
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            <ArrowUp className="size-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
