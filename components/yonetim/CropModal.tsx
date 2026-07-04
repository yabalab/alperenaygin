"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedWebp, type PixelArea } from "@/lib/cms/crop";

export default function CropModal({
  imageSrc,
  aspect,
  onConfirm,
  onCancel,
  busy,
}: {
  imageSrc: string;
  aspect: number;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
  busy: boolean;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<PixelArea | null>(null);
  const [working, setWorking] = useState(false);

  const onCropComplete = useCallback((_: unknown, pixels: PixelArea) => {
    setArea(pixels);
  }, []);

  const confirm = async () => {
    if (!area) return;
    setWorking(true);
    try {
      const blob = await getCroppedWebp(imageSrc, area);
      onConfirm(blob);
    } catch {
      setWorking(false);
    }
  };

  const pending = busy || working;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-ink-deep/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="font-body text-[12px] uppercase tracking-label text-paper/70">
          Kırp ve konumlandır
        </span>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="font-body text-[13px] text-paper/70 hover:text-paper disabled:opacity-40"
        >
          İptal
        </button>
      </div>

      {/* Crop surface (touch: pinch to zoom, drag to move) */}
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid
        />
      </div>

      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <label className="flex flex-1 items-center gap-3">
          <span className="font-body text-[11px] uppercase tracking-label text-paper/60">
            Yakınlaştır
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-gold"
          />
        </label>
        <button
          type="button"
          onClick={confirm}
          disabled={pending || !area}
          className="rounded-lg bg-paper px-6 py-3 font-body text-[13px] uppercase tracking-label text-ink-deep transition-opacity hover:bg-gold disabled:opacity-50"
        >
          {pending ? "İşleniyor…" : "Onayla"}
        </button>
      </div>
    </div>
  );
}
