"use client";
import { assetUrl } from "@/infrastructure/config";
import { useTranslation } from "@/i18n/LocaleProvider";

export function TokenImageModal({
  open,
  title,
  imageUrl,
  onClose,
}: {
  open: boolean;
  title: string;
  imageUrl: string;
  onClose: () => void;
}) {
  const t = useTranslation();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={title}
    >
      <div
        className="flex max-h-[92vh] max-w-[92vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetUrl(imageUrl)}
          alt={title}
          className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
        />
        <p className="mt-3 font-display text-lg text-white">{title}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 rounded bg-panel2 px-4 py-1.5 text-sm text-parchment hover:bg-arcane hover:text-white"
        >
          {t.common.close}
        </button>
      </div>
    </div>
  );
}
