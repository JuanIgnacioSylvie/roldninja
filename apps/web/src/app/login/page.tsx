"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/infrastructure/state/authStore";
import { useApi } from "@/infrastructure/composition";
import { Button, Card, Input, Label } from "@/components/ui";
import { useTranslation } from "@/i18n/LocaleProvider";

export default function LoginPage() {
  const router = useRouter();
  const api = useApi();
  const setAuth = useAuth((s) => s.setAuth);
  const t = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(username, password);
      setAuth(data.token, data.user);
      router.replace("/campaigns");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-1 text-center font-display text-3xl text-white">{t.auth.title}</h1>
        <p className="mb-6 text-center text-sm text-muted">{t.auth.subtitle}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="username">{t.auth.username}</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">{t.auth.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? t.auth.loggingIn : t.auth.login}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-parchment/40">{t.auth.adminNote}</p>
      </Card>
    </div>
  );
}
