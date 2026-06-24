"use client";
import { useEffect, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CampaignShell } from "@/components/CampaignShell";
import { useTranslation, useLocale } from "@/i18n/LocaleProvider";
import { resolveManualEmbedUrl, resolveManualOpenUrl, type ManualId } from "@/lib/srd-i18n";
import { cn } from "@/lib/utils";

const MANUALS: { id: ManualId; labelKey: "phb" | "dmg" | "mm" }[] = [
  { id: "phb", labelKey: "phb" },
  { id: "dmg", labelKey: "dmg" },
  { id: "mm", labelKey: "mm" },
];

export default function ManualsPage() {
  const t = useTranslation();
  const { locale } = useLocale();
  const [selected, setSelected] = useState(MANUALS[0]!);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [openUrl, setOpenUrl] = useState<string | null>(null);

  const labels = {
    phb: t.manuals.phb,
    dmg: t.manuals.dmg,
    mm: t.manuals.mm,
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      resolveManualEmbedUrl(selected.id, locale),
      resolveManualOpenUrl(selected.id, locale),
    ]).then(([embed, open]) => {
      if (!active) return;
      setEmbedUrl(embed);
      setOpenUrl(open);
    });
    return () => {
      active = false;
    };
  }, [selected, locale]);

  return (
    <AppShell>
      <CampaignShell>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h1 className="font-display text-lg text-gold">{t.manuals.title}</h1>
            {openUrl && (
              <a
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-parchment/60 transition hover:text-gold"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t.manuals.openInDrive}
              </a>
            )}
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[220px_1fr]">
            <div className="overflow-y-auto border-r border-white/10 p-2">
              {MANUALS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={cn(
                    "mb-1 flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm",
                    selected.id === m.id ? "bg-arcane text-white" : "hover:bg-white/10 text-parchment/70",
                  )}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  {labels[m.labelKey]}
                </button>
              ))}
            </div>
            <div className="relative min-h-0 bg-black/30">
              {embedUrl ? (
                <iframe
                  key={embedUrl}
                  src={embedUrl}
                  className="h-full w-full border-0"
                  title={labels[selected.labelKey]}
                  allow="autoplay"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-parchment/50">{t.common.loading}</div>
              )}
            </div>
          </div>
        </div>
      </CampaignShell>
    </AppShell>
  );
}
