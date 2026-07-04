"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia, deleteMedia } from "@/app/yonetim/media-actions";
import { mediaSizeUrl, type MediaRow } from "@/lib/cms/media";
import CropModal from "./CropModal";

export default function ImageField({
  alan,
  label,
  aspect,
  oran,
  current,
  fallbackSrc,
}: {
  alan: string;
  label: string;
  aspect: number; // width/height, e.g. 3/4
  oran: string; // stored ratio label, e.g. "3:4"
  current: MediaRow | null;
  fallbackSrc: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const previewSrc = current ? mediaSizeUrl(current.storage_path, 800) : fallbackSrc;
  const isDefault = !current;

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setCropSrc(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onConfirmCrop = (blob: Blob) => {
    const fd = new FormData();
    fd.append("file", blob, "crop.webp");
    fd.append("alan", alan);
    fd.append("oran", oran);
    startTransition(async () => {
      try {
        const res = await uploadMedia(fd);
        if (res.ok) {
          setCropSrc(null);
          router.refresh();
        } else {
          setError(res.error);
          setCropSrc(null);
        }
      } catch (e) {
        // A thrown (not returned) server action must never fail silently.
        setError(
          e instanceof Error ? `Hata: ${e.message}` : "Beklenmeyen yükleme hatası."
        );
        setCropSrc(null);
      }
    });
  };

  const onDelete = () => {
    const fd = new FormData();
    fd.append("alan", alan);
    startTransition(async () => {
      const res = await deleteMedia(fd);
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  };

  return (
    <div className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/60">
          {label}
        </span>
        {isDefault && (
          <span className="font-body text-[11px] text-ink-soft/40">
            varsayılan görsel
          </span>
        )}
      </div>

      <div className="flex items-start gap-4">
        <div
          className="w-28 shrink-0 overflow-hidden rounded-lg border border-ink-deep/10 bg-paper"
          style={{ aspectRatio: String(aspect) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt={label}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPick}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending}
            className="rounded-lg bg-ink-deep px-4 py-2.5 font-body text-[12px] uppercase tracking-label text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {current ? "Görseli değiştir" : "Görsel seç"}
          </button>
          {current && (
            <button
              type="button"
              onClick={onDelete}
              disabled={pending}
              className="rounded-lg border border-rose-300 px-4 py-2.5 font-body text-[12px] text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50"
            >
              Sil (varsayılana dön)
            </button>
          )}
          <p className="font-body text-[12px] text-ink-soft/50">
            Oran {oran}. Seçince kırpma ekranı açılır.
          </p>
          {error && (
            <p className="font-body text-[12px] text-rose-700">{error}</p>
          )}
        </div>
      </div>

      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          aspect={aspect}
          busy={pending}
          onCancel={() => setCropSrc(null)}
          onConfirm={onConfirmCrop}
        />
      )}
    </div>
  );
}
