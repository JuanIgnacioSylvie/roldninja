"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/LocaleProvider";

interface NotepadWidgetProps {
  storageKey: string;
}

export function NotepadWidget({ storageKey }: NotepadWidgetProps) {
  const t = useTranslation();
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setNotes(saved);
  }, [storageKey]);

  function onChange(value: string) {
    setNotes(value);
    localStorage.setItem(storageKey, value);
  }

  return (
    <textarea
      value={notes}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t.notepad.placeholder}
      className="h-full w-full resize-none bg-transparent p-2 text-sm text-parchment/80 placeholder:text-parchment/30 focus:outline-none"
    />
  );
}
