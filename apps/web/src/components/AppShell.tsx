"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/infrastructure/state/authStore";
import { LanguageToggle } from "@/components/CampaignShell";
import { Button } from "@/components/ui";
import { useTranslation } from "@/i18n/LocaleProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, user, logout } = useAuth();
  const t = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) router.replace("/login");
    else setReady(true);
  }, [token, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-parchment/60">{t.common.loading}</div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.06] bg-ink/90 px-4 py-3 backdrop-blur-md">
        <Link href="/campaigns" className="font-hero text-xl tracking-wide text-white">
          Roldninja
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{user.displayName}</span>
          <LanguageToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            title={t.nav.logout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
