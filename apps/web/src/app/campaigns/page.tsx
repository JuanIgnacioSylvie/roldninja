"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, Crown, UserPlus, Globe, Lock } from "lucide-react";
import type { PublicCampaignSummaryDTO } from "@roldninja/contracts";
import { useApi } from "@/infrastructure/composition";
import { AppShell } from "@/components/AppShell";
import { Button, Card, Input, Label, Modal } from "@/components/ui";
import { useTranslation } from "@/i18n/LocaleProvider";

interface CampaignItem {
  id: string;
  name: string;
  description: string | null;
  visibility: "public" | "private";
  dmName: string;
  isDM: boolean;
  memberCount: number;
  characterCount: number;
}

export default function CampaignsPage() {
  const router = useRouter();
  const api = useApi();
  const t = useTranslation();
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [publicCampaigns, setPublicCampaigns] = useState<PublicCampaignSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [abilityScoreMethod, setAbilityScoreMethod] = useState<"pointbuy" | "array">("pointbuy");
  const [visibility, setVisibility] = useState<"public" | "private">("private");

  async function load() {
    try {
      const [mine, pub] = await Promise.all([api.listCampaigns(), api.listPublicCampaigns()]);
      setCampaigns(mine);
      setPublicCampaigns(pub);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function closeJoinModal() {
    setJoining(false);
    setJoinError(null);
  }

  function closeCreateModal() {
    setCreating(false);
  }

  function openJoinModal() {
    setCreating(false);
    setJoinError(null);
    setJoining(true);
  }

  function openCreateModal() {
    setJoining(false);
    setCreating(true);
  }

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (visibility === "private" && !createPassword.trim()) return;
    await api.createCampaign(
      name,
      undefined,
      abilityScoreMethod,
      visibility,
      visibility === "private" ? createPassword : undefined,
    );
    setName("");
    setCreatePassword("");
    setAbilityScoreMethod("pointbuy");
    setVisibility("private");
    closeCreateModal();
    void load();
  }

  async function joinCampaign(e: React.FormEvent) {
    e.preventDefault();
    const code = joinCode.trim();
    if (!code) return;
    setJoinError(null);
    try {
      await api.joinCampaign(code, joinPassword.trim() || undefined);
      setJoinCode("");
      setJoinPassword("");
      closeJoinModal();
      void load();
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : t.campaigns.joinError);
    }
  }

  async function applyToPublic(campaignId: string) {
    setApplyError(null);
    setApplyingId(campaignId);
    try {
      await api.joinCampaign(campaignId);
      void load();
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : t.campaigns.joinError);
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-hero text-3xl tracking-wide text-parchment">{t.campaigns.title}</h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={openJoinModal}>
              <UserPlus className="mr-1 inline h-4 w-4" /> {t.campaigns.join}
            </Button>
            <Button variant="gold" onClick={openCreateModal}>
              <Plus className="mr-1 inline h-4 w-4" /> {t.nav.newCampaign}
            </Button>
          </div>
        </div>

        <Modal open={joining} title={t.campaigns.join} onClose={closeJoinModal}>
          <form onSubmit={joinCampaign} className="space-y-3">
            <p className="text-sm text-parchment/60">{t.campaigns.joinHint}</p>
            <Input
              placeholder={t.campaigns.joinPlaceholder}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              autoFocus
            />
            <Input
              type="password"
              placeholder={t.campaigns.joinPasswordPlaceholder}
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
            />
            {joinError && <p className="text-sm text-red-400">{joinError}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={closeJoinModal}>
                {t.common.cancel}
              </Button>
              <Button type="submit" variant="gold">
                {t.campaigns.join}
              </Button>
            </div>
          </form>
        </Modal>

        <Modal open={creating} title={t.nav.newCampaign} onClose={closeCreateModal}>
          <form onSubmit={createCampaign} className="space-y-3">
            <Input
              placeholder={t.campaigns.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <div>
              <p className="mb-2 text-sm text-parchment/70">{t.campaigns.visibility}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={visibility === "public" ? "gold" : "ghost"}
                  size="sm"
                  onClick={() => setVisibility("public")}
                >
                  <Globe className="mr-1 inline h-3.5 w-3.5" /> {t.campaigns.visibilityPublic}
                </Button>
                <Button
                  type="button"
                  variant={visibility === "private" ? "gold" : "ghost"}
                  size="sm"
                  onClick={() => setVisibility("private")}
                >
                  <Lock className="mr-1 inline h-3.5 w-3.5" /> {t.campaigns.visibilityPrivate}
                </Button>
              </div>
              <p className="mt-2 text-xs text-parchment/50">
                {visibility === "public" ? t.campaigns.visibilityPublicHint : t.campaigns.visibilityPrivateHint}
              </p>
            </div>
            {visibility === "private" && (
              <div className="space-y-1">
                <Label htmlFor="create-password">{t.campaigns.createPassword}</Label>
                <Input
                  id="create-password"
                  type="password"
                  placeholder={t.campaigns.createPasswordPlaceholder}
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                />
              </div>
            )}
            <div>
              <p className="mb-2 text-sm text-parchment/70">{t.campaigns.abilityScoreMethod}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={abilityScoreMethod === "pointbuy" ? "gold" : "ghost"}
                  size="sm"
                  onClick={() => setAbilityScoreMethod("pointbuy")}
                >
                  {t.campaigns.abilityScorePointBuy}
                </Button>
                <Button
                  type="button"
                  variant={abilityScoreMethod === "array" ? "gold" : "ghost"}
                  size="sm"
                  onClick={() => setAbilityScoreMethod("array")}
                >
                  {t.campaigns.abilityScoreArray}
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={closeCreateModal}>
                {t.common.cancel}
              </Button>
              <Button type="submit" variant="gold" disabled={visibility === "private" && !createPassword.trim()}>
                {t.common.create}
              </Button>
            </div>
          </form>
        </Modal>

        {loading ? (
          <p className="text-parchment/60">{t.campaigns.loading}</p>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="mb-4 font-display text-lg text-parchment">{t.campaigns.myCampaigns}</h2>
              {campaigns.length === 0 ? (
                <p className="text-parchment/60">{t.campaigns.empty}</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {campaigns.map((c) => (
                    <Card
                      key={c.id}
                      className="cursor-pointer p-5 transition hover:border-white/20"
                      onClick={() => router.push(`/campaigns/${c.id}/characters`)}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="font-display text-lg text-gold">{c.name}</h3>
                        <div className="flex items-center gap-1.5">
                          {c.visibility === "public" ? (
                            <Globe className="h-3.5 w-3.5 text-parchment/40" aria-hidden />
                          ) : (
                            <Lock className="h-3.5 w-3.5 text-parchment/40" aria-hidden />
                          )}
                          {c.isDM && <Crown className="h-4 w-4 text-gold" />}
                        </div>
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm text-parchment/60">
                        {c.description || t.campaigns.noDescription}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-parchment/50">
                        <span>
                          {t.campaigns.dm}: {c.dmName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {c.memberCount}
                        </span>
                      </div>
                      {c.isDM && (
                        <p className="mt-2 text-xs text-parchment/40">
                          {t.campaigns.inviteCode}: <span className="font-mono text-parchment/60">{c.id}</span>
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-4 font-display text-lg text-parchment">{t.campaigns.publicCampaigns}</h2>
              {applyError && <p className="mb-3 text-sm text-red-400">{applyError}</p>}
              {publicCampaigns.length === 0 ? (
                <p className="text-parchment/60">{t.campaigns.publicCampaignsEmpty}</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {publicCampaigns.map((c) => (
                    <Card key={c.id} className="flex flex-col p-5">
                      <h3 className="mb-2 font-display text-lg text-gold">{c.name}</h3>
                      <p className="mb-3 line-clamp-2 flex-1 text-sm text-parchment/60">
                        {c.description || t.campaigns.noDescription}
                      </p>
                      <div className="mb-4 flex items-center gap-4 text-xs text-parchment/50">
                        <span>
                          {t.campaigns.dm}: {c.dmName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {c.memberCount}
                        </span>
                      </div>
                      <Button
                        variant="gold"
                        size="sm"
                        disabled={applyingId === c.id}
                        onClick={() => void applyToPublic(c.id)}
                      >
                        {applyingId === c.id ? t.campaigns.applying : t.campaigns.apply}
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
