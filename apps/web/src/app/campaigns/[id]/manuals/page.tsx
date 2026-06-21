"use client";
import { useEffect, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CampaignShell } from "@/components/CampaignShell";
import { Card } from "@/components/ui";
import { useTranslation, useLocale } from "@/i18n/LocaleProvider";
import { useApi } from "@/infrastructure/composition";
import { assetUrl } from "@/infrastructure/config";
import {
  getManualUrl,
  manualStaticPath,
  resolveManualPdfUrl,
  setManualUrl,
  type ManualId,
} from "@/lib/srd-i18n";
import { cn } from "@/lib/utils";

const MANUALS: { id: ManualId; labelKey: "phb" | "dmg" | "mm" }[] = [
  { id: "phb", labelKey: "phb" },
  { id: "dmg", labelKey: "dmg" },
  { id: "mm", labelKey: "mm" },
];

export default function ManualsPage() {
  const t = useTranslation();
  const { locale } = useLocale();
  const api = useApi();
  const [selected, setSelected] = useState(MANUALS[0]!);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [uploading, setUploading] = useState(false);

  const labels = {
    phb: t.manuals.phb,
    dmg: t.manuals.dmg,
    mm: t.manuals.mm,
  };

  useEffect(() => {
    let active = true;
    async function resolve() {
      setChecking(true);
      const staticUrl = await resolveManualPdfUrl(selected.id, locale);
      if (!active) return;
      if (staticUrl) {
        setPdfUrl(staticUrl.startsWith("http") ? staticUrl : staticUrl);
        setChecking(false);
        return;
      }
      const stored = getManualUrl(selected.id, locale) ?? getManualUrl(selected.id, "en");
      if (stored) {
        const full = assetUrl(stored)!;
        setPdfUrl(full);
        setChecking(false);
        return;
      }
      setPdfUrl(null);
      setChecking(false);
    }
    void resolve();
    return () => { active = false; };
  }, [selected, locale]);

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      setManualUrl(selected.id, url, locale);
      setPdfUrl(assetUrl(url)!);
    } finally {
      setUploading(false);
    }
  }

  const expectedPath = manualStaticPath(selected.id, locale);

  return (
    <AppShell>
      <CampaignShell>
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-4 py-3">
            <h1 className="font-display text-lg text-gold">{t.manuals.title}</h1>
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
              {checking ? (
                <div className="flex h-full items-center justify-center text-parchment/50">{t.common.loading}</div>
              ) : pdfUrl ? (
                <iframe
                  key={pdfUrl}
                  src={pdfUrl}
                  className="h-full w-full border-0"
                  title={labels[selected.labelKey]}
                />
              ) : (
                <Card className="m-6 flex flex-col items-center gap-4 p-8 text-center">
                  <FileText className="h-12 w-12 text-parchment/30" />
                  <p className="text-parchment/60">{t.manuals.notFound}</p>
                  <p className="text-xs text-parchment/40">{expectedPath}</p>
                  <label className="cursor-pointer rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold/80">
                    <Upload className="mr-1 inline h-4 w-4" />
                    {uploading ? "..." : t.manuals.upload}
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => e.target.files?.[0] && void onUpload(e.target.files[0])}
                    />
                  </label>
                </Card>
              )}
            </div>
          </div>
        </div>
      </CampaignShell>
    </AppShell>
  );
}
