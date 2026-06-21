"use client";
import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

/** Redirige la ruta legacy /session al nuevo dashboard. */
export default function SessionRedirectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const character = searchParams.get("character");

  useEffect(() => {
    const q = character ? `?character=${character}` : "";
    router.replace(`/campaigns/${id}/dashboard${q}`);
  }, [router, id, character]);

  return null;
}
