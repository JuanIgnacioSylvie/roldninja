"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/infrastructure/state/authStore";

export default function Home() {
  const router = useRouter();
  const token = useAuth((s) => s.token);

  useEffect(() => {
    router.replace(token ? "/campaigns" : "/login");
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-parchment/60 font-display text-xl">Cargando la mesa...</p>
    </div>
  );
}
