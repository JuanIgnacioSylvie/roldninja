"use client";
import { useEffect, useRef, useState } from "react";
import { Dices, Send } from "lucide-react";
import type { ChatMessageDTO } from "@roldninja/contracts";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

const QUICK_DICE = ["1d20", "1d12", "1d10", "1d8", "1d6", "1d4", "2d6"];

export function ChatWidget({
  messages,
  onSend,
  onRoll,
}: {
  messages: ChatMessageDTO[];
  onSend: (content: string) => void;
  onRoll: (notation: string, label?: string) => void;
}) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    // /roll 1d20+3  o  /r 2d6
    const rollMatch = value.match(/^\/(?:roll|r)\s+(.+)$/i);
    if (rollMatch) onRoll(rollMatch[1]!);
    else onSend(value);
    setText("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            {m.kind === "ROLL" ? (
              <div className="rounded-md bg-arcane/15 px-2 py-1">
                <span className="text-gold">🎲 {m.authorName}</span>{" "}
                <span className="text-parchment/90">{m.content}</span>
              </div>
            ) : m.kind === "SYSTEM" ? (
              <div className="italic text-parchment/50">{m.content}</div>
            ) : (
              <div>
                <span className="font-semibold text-gold">{m.authorName}:</span>{" "}
                <span className="text-parchment/90">{m.content}</span>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 p-2">
        <div className="mb-2 flex flex-wrap gap-1">
          {QUICK_DICE.map((d) => (
            <button
              key={d}
              onClick={() => onRoll(d)}
              className={cn("rounded bg-panel2 px-2 py-0.5 text-xs text-parchment/70 hover:bg-arcane hover:text-white")}
            >
              {d}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Mensaje o /roll 1d20+5"
            className="text-sm"
          />
          <Button type="submit" size="icon" variant="gold" title="Enviar">
            {text.startsWith("/") ? <Dices className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
