"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import type { Character, CharacterSheet } from "@roldninja/domain";
import { useApi } from "@/infrastructure/composition";
import { useAuth } from "@/infrastructure/state/authStore";
import { CharacterSheetEditor } from "@/components/character-sheet/CharacterSheetEditor";
import { normalizeSheet, type SheetMeta } from "@/lib/character-sheet-utils";
import { cn } from "@/lib/utils";

export default function CharacterSheetPage() {
  const router = useRouter();
  const api = useApi();
  const { id, charId } = useParams<{ id: string; charId: string }>();
  const userId = useAuth((s) => s.user?.id);

  const [character, setCharacter] = useState<Character | null>(null);
  const [isDM, setIsDM] = useState(false);
  const [sheet, setSheet] = useState<CharacterSheet | null>(null);
  const [meta, setMeta] = useState<SheetMeta>({ name: "", species: "", class: "", background: "", level: 1 });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    void api.getCampaign(id).then((c) => setIsDM(c.isDM));
  }, [id, api]);

  useEffect(() => {
    void api.getCharacter(charId).then((c) => {
      setCharacter(c);
      setMeta({
        name: c.name ?? "",
        species: c.species ?? "",
        class: c.class ?? "",
        background: c.background ?? "",
        level: c.level ?? 1,
      });
      setSheet(normalizeSheet(c.sheet as Partial<CharacterSheet>));
    });
  }, [charId, api]);

  const canEdit = !!character && (character.ownerId === userId || isDM);

  function handleSheetChange(patch: Partial<CharacterSheet>) {
    setSheet((prev) => (prev ? { ...prev, ...patch } : prev));
    setDirty(true);
  }
  function handleMetaChange(patch: Partial<SheetMeta>) {
    setMeta((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }

  async function save() {
    if (!sheet) return;
    setSaving(true);
    try {
      await api.updateCharacter(charId, {
        name: meta.name,
        species: meta.species || null,
        class: meta.class || null,
        background: meta.background || null,
        level: meta.level,
        sheet,
      });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  async function onPortraitUpload(file: File) {
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      handleSheetChange({ portraitUrl: url });
    } finally {
      setUploading(false);
    }
  }

  if (!sheet || !character) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2b2b2b] text-parchment/60">
        Cargando hoja...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#262626] py-4">
      <div className="sticky top-0 z-20 mx-auto mb-4 flex max-w-6xl items-center justify-between gap-2 px-3">
        <button
          onClick={() => router.push(`/campaigns/${id}/characters`)}
          className="flex items-center gap-1 rounded-md bg-black/40 px-3 py-1.5 text-sm text-parchment hover:bg-black/60"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        {canEdit ? (
          <button
            onClick={() => void save()}
            disabled={saving || !dirty}
            className={cn(
              "flex items-center gap-1 rounded-md px-4 py-1.5 text-sm font-semibold transition",
              dirty ? "bg-brand text-white hover:bg-brand-light" : "bg-black/40 text-parchment/50",
            )}
          >
            <Save className="h-4 w-4" /> {saving ? "Guardando..." : dirty ? "Guardar cambios" : "Guardado"}
          </button>
        ) : (
          <span className="rounded-md bg-black/40 px-3 py-1.5 text-xs text-parchment/60">Solo lectura</span>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-3">
        <CharacterSheetEditor
          sheet={sheet}
          meta={meta}
          readOnly={!canEdit}
          uploading={uploading}
          onSheetChange={handleSheetChange}
          onMetaChange={handleMetaChange}
          onPortraitUpload={canEdit ? onPortraitUpload : undefined}
        />
      </div>
    </div>
  );
}
