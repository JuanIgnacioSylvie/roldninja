"use client";
import { Dices, X } from "lucide-react";
import { Button, Card } from "@/components/ui";

export function InitiativePrompt({
  open,
  characterName,
  onRoll,
  onCancel,
}: {
  open: boolean;
  characterName: string;
  onRoll: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-sm p-6 text-center">
        <Dices className="mx-auto mb-3 h-10 w-10 text-gold" />
        <h2 className="mb-1 font-display text-xl text-gold">¡Comienza el combate!</h2>
        <p className="mb-5 text-sm text-parchment/70">
          {characterName}, tirá tu iniciativa (1d20 + mod. de Destreza).
        </p>
        <div className="flex gap-2">
          <Button variant="gold" className="flex-1" onClick={onRoll}>
            <Dices className="mr-1 inline h-4 w-4" /> Tirar iniciativa
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            <X className="mr-1 inline h-4 w-4" /> Cancelar
          </Button>
        </div>
      </Card>
    </div>
  );
}
