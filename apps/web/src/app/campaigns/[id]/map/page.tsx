"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Upload, Wand2, Map as MapIcon, RefreshCw } from "lucide-react";
import { useApi } from "@/infrastructure/composition";
import { AppShell } from "@/components/AppShell";
import { CampaignShell } from "@/components/CampaignShell";
import { Button, Card, Input } from "@/components/ui";
import { AZGAAR_URL, assetUrl } from "@/infrastructure/config";
import { useTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

interface WorldMap {
  id: string;
  name: string;
  type: string;
  fileUrl: string | null;
}

export default function MapPage() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const t = useTranslation();
  const [isDM, setIsDM] = useState(false);
  const [tab, setTab] = useState<"generator" | "uploaded">("generator");
  const [maps, setMaps] = useState<WorldMap[]>([]);
  const [selected, setSelected] = useState<WorldMap | null>(null);
  const [uploadName, setUploadName] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    void api.getCampaign(id).then((c) => setIsDM(c.isDM));
  }, [id, api]);

  async function loadMaps() {
    const data = await api.listWorldMaps(id);
    setMaps(data);
    if (!selected && data[0]) setSelected(data[0]);
  }
  useEffect(() => {
    void loadMaps();
  }, [id]);

  async function onUpload(file: File) {
    const { url } = await api.uploadFile(file);
    await api.createWorldMap({
      campaignId: id,
      name: uploadName || file.name,
      type: "uploaded",
      fileUrl: url,
    });
    setUploadName("");
    setTab("uploaded");
    await loadMaps();
  }

  return (
    <AppShell>
      <CampaignShell>
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2">
            <h1 className="font-display text-lg text-gold">{t.map.title}</h1>

            <div className="ml-4 flex gap-1">
              <Button variant={tab === "generator" ? "gold" : "ghost"} size="sm" onClick={() => setTab("generator")}>
                <Wand2 className="mr-1 inline h-3 w-3" /> {t.map.generator}
              </Button>
              <Button variant={tab === "uploaded" ? "gold" : "ghost"} size="sm" onClick={() => setTab("uploaded")}>
                <MapIcon className="mr-1 inline h-3 w-3" /> {t.map.saved}
              </Button>
            </div>

            {isDM && (
              <div className="ml-auto flex items-center gap-2">
                <Input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder={t.map.namePlaceholder}
                  className="w-40 text-sm"
                />
                <label className="cursor-pointer rounded-md bg-gold px-3 py-2 text-sm font-semibold text-ink hover:bg-gold/80">
                  <Upload className="mr-1 inline h-4 w-4" /> {t.map.upload}
                  <input
                    type="file"
                    accept="image/*,.map,.svg"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="min-h-0 flex-1">
            {tab === "generator" ? (
              <div className="relative h-full min-h-[500px]">
                <iframe
                  ref={iframeRef}
                  src={AZGAAR_URL}
                  className="h-full w-full border-0 bg-white"
                  title="Azgaar Fantasy Map Generator"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-3 bg-ink/70"
                  onClick={() => {
                    if (iframeRef.current) iframeRef.current.src = AZGAAR_URL;
                  }}
                >
                  <RefreshCw className="mr-1 inline h-3 w-3" /> {t.map.regenerate}
                </Button>
              </div>
            ) : (
              <div className="grid h-full min-h-[500px] grid-cols-[220px_1fr]">
                <div className="overflow-y-auto border-r border-white/10 p-2">
                  {maps.length === 0 ? (
                    <p className="p-2 text-sm text-parchment/50">{t.map.empty}</p>
                  ) : (
                    maps.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelected(m)}
                        className={cn(
                          "mb-1 w-full rounded px-2 py-1.5 text-left text-sm",
                          selected?.id === m.id ? "bg-arcane text-white" : "hover:bg-white/10",
                        )}
                      >
                        {m.name}
                      </button>
                    ))
                  )}
                </div>
                <div className="flex items-center justify-center overflow-auto bg-black/40 p-4">
                  {selected?.fileUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={assetUrl(selected.fileUrl)} alt={selected.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <Card className="p-6 text-parchment/50">{t.map.select}</Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CampaignShell>
    </AppShell>
  );
}
