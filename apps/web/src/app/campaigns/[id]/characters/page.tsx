"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Swords, ScrollText, CheckCircle2, Clock, FileText } from "lucide-react";
import { useApi } from "@/infrastructure/composition";
import { AppShell } from "@/components/AppShell";
import { CampaignShell } from "@/components/CampaignShell";
import { Badge, Button, Card } from "@/components/ui";
import { useTranslation } from "@/i18n/LocaleProvider";

interface CharacterItem {
  id: string;
  name: string;
  species: string | null;
  class: string | null;
  background: string | null;
  level: number;
  isComplete: boolean;
  ownerName: string;
  isMine: boolean;
}

interface CampaignDetail {
  id: string;
  name: string;
  isDM: boolean;
}

export default function CharactersPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const t = useTranslation();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [characters, setCharacters] = useState<CharacterItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [c, chars] = await Promise.all([
      api.getCampaign(id),
      api.listCharacters(id),
    ]);
    setCampaign(c);
    setCharacters(chars);
    setLoading(false);
  }
  useEffect(() => {
    void load();
  }, [id]);

  async function createCharacter() {
    const ch = await api.createCharacter(id, "Nuevo personaje");
    router.push(`/campaigns/${id}/characters/${ch.id}/create`);
  }

  function enterSession(characterId?: string) {
    const q = characterId ? `?character=${characterId}` : "";
    router.push(`/campaigns/${id}/dashboard${q}`);
  }

  const isDM = campaign?.isDM ?? false;

  return (
    <AppShell>
      <CampaignShell>
        <div className="mx-auto max-w-5xl p-4 sm:p-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h1 className="font-display text-2xl text-gold">{campaign?.name ?? "..."}</h1>
            {isDM && (
              <Button variant="gold" onClick={() => enterSession()}>
                <Swords className="mr-1 inline h-4 w-4" /> {t.characters.enterSessionDM}
              </Button>
            )}
          </div>
          <p className="mb-6 text-sm text-parchment/60">
            {isDM ? t.characters.dmView : t.characters.playerView}
          </p>

          {loading ? (
            <p className="text-parchment/60">{t.common.loading}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {!isDM && (
                <Card
                  className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center border-dashed p-5 text-parchment/60 transition hover:border-gold hover:text-gold"
                  onClick={createCharacter}
                >
                  <Plus className="mb-2 h-8 w-8" />
                  <span className="font-display">{t.characters.create}</span>
                </Card>
              )}

              {characters.map((ch) => (
                <Card key={ch.id} className="flex flex-col p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="font-display text-lg text-parchment">{ch.name}</h2>
                    {ch.isComplete ? (
                      <Badge className="bg-green-700/60 text-green-100">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> {t.characters.ready}
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-700/50 text-yellow-100">
                        <Clock className="mr-1 h-3 w-3" /> {t.characters.draft}
                      </Badge>
                    )}
                  </div>
                  <p className="mb-3 text-sm text-parchment/60">
                    {[ch.species, ch.class].filter(Boolean).join(" · ") || t.characters.undefined} · {t.characters.level} {ch.level}
                  </p>
                  {isDM && <p className="mb-3 text-xs text-parchment/40">{t.characters.player}: {ch.ownerName}</p>}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {ch.isMine && !ch.isComplete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/campaigns/${id}/characters/${ch.id}/create`)}
                      >
                        <ScrollText className="mr-1 inline h-3 w-3" /> {t.characters.continue}
                      </Button>
                    )}
                    {(ch.isMine || isDM) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/campaigns/${id}/characters/${ch.id}/sheet`)}
                      >
                        <FileText className="mr-1 inline h-3 w-3" />
                        {ch.isMine ? t.characters.editSheet : t.characters.viewSheet}
                      </Button>
                    )}
                    {ch.isComplete && (
                      <Button variant="gold" size="sm" onClick={() => enterSession(ch.id)}>
                        <Swords className="mr-1 inline h-3 w-3" /> {t.characters.play}
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CampaignShell>
    </AppShell>
  );
}
