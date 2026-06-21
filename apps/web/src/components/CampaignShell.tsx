"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  BookOpen,
  Globe,
  LayoutDashboard,
  ScrollText,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApi } from "@/infrastructure/composition";
import { useTranslation, useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

interface CampaignShellProps {
  children: React.ReactNode;
  characterId?: string | null;
}

export function CampaignShell({ children, characterId }: CampaignShellProps) {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const api = useApi();
  const t = useTranslation();
  const [campaignName, setCampaignName] = useState("");
  const [isDM, setIsDM] = useState(false);

  useEffect(() => {
    void api.getCampaign(id).then((c) => {
      setCampaignName(c.name);
      setIsDM(c.isDM);
    });
  }, [id, api]);

  const charQuery = characterId ? `?character=${characterId}` : "";

  const links = [
    {
      href: `/campaigns/${id}/dashboard${charQuery}`,
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      match: "/dashboard",
    },
    {
      href: `/campaigns/${id}/map`,
      label: t.nav.worldMap,
      icon: Globe,
      match: "/map",
    },
    {
      href: `/campaigns/${id}/manuals`,
      label: t.nav.manuals,
      icon: BookOpen,
      match: "/manuals",
    },
    {
      href: `/campaigns/${id}/characters`,
      label: t.nav.characters,
      icon: ScrollText,
      match: "/characters",
    },
  ];

  return (
    <div className="flex h-[calc(100vh-57px)]">
      <aside className="flex w-52 shrink-0 flex-col border-r border-white/[0.06] bg-surface/50">
        <div className="border-b border-white/[0.06] px-3 py-3">
          <h2 className="truncate font-display text-sm text-white">{campaignName || "..."}</h2>
          <span
            className={cn(
              "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              isDM ? "bg-white/10 text-white" : "bg-brand/20 text-brand-light",
            )}
          >
            {isDM ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {isDM ? t.nav.roleDM : t.nav.rolePlayer}
          </span>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {links.map(({ href, label, icon: Icon, match }) => {
            const active = pathname.includes(match);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-muted hover:bg-white/5 hover:text-parchment",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

/** Toggle de idioma para el header. */
export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div className="flex rounded-lg border border-white/10 text-xs overflow-hidden">
      {(["es", "en"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          className={cn(
            "px-2.5 py-1 transition",
            locale === lang ? "bg-white text-ink" : "text-muted hover:text-parchment",
          )}
        >
          {t.language[lang]}
        </button>
      ))}
    </div>
  );
}
