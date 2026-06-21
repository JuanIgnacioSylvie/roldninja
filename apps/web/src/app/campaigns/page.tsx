"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, Crown } from "lucide-react";
import { useApi } from "@/infrastructure/composition";
import { AppShell } from "@/components/AppShell";
import { Button, Card, Input } from "@/components/ui";
import { useTranslation } from "@/i18n/LocaleProvider";

interface CampaignItem {
  id: string;
  name: string;
  description: string | null;
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
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  async function load() {
    try {
      setCampaigns(await api.listCampaigns());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.createCampaign(name);
    setName("");
    setCreating(false);
    void load();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl text-parchment">{t.campaigns.title}</h1>
          <Button variant="gold" onClick={() => setCreating((v) => !v)}>
            <Plus className="mr-1 inline h-4 w-4" /> {t.nav.newCampaign}
          </Button>
        </div>

        {creating && (
          <Card className="mb-6 p-4">
            <form onSubmit={createCampaign} className="flex gap-2">
              <Input placeholder={t.campaigns.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              <Button type="submit" variant="gold">{t.common.create}</Button>
            </form>
          </Card>
        )}

        {loading ? (
          <p className="text-parchment/60">{t.campaigns.loading}</p>
        ) : campaigns.length === 0 ? (
          <p className="text-parchment/60">{t.campaigns.empty}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <Card
                key={c.id}
                className="cursor-pointer p-5 transition hover:border-white/20"
                onClick={() => router.push(`/campaigns/${c.id}/characters`)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-display text-lg text-gold">{c.name}</h2>
                  {c.isDM && <Crown className="h-4 w-4 text-gold" />}
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-parchment/60">
                  {c.description || t.campaigns.noDescription}
                </p>
                <div className="flex items-center gap-4 text-xs text-parchment/50">
                  <span>{t.campaigns.dm}: {c.dmName}</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {c.memberCount}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
