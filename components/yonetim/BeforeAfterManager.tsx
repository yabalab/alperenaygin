"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { BeforeAfterRow } from "@/lib/cms/before-after";
import { mediaSizeUrl } from "@/lib/cms/media";
import { buildCaption } from "@/lib/proof-items";
import CropModal from "./CropModal";
import {
  createBeforeAfter,
  deleteBeforeAfter,
  toggleBeforeAfter,
  moveBeforeAfter,
  updateBeforeAfterText,
} from "@/app/yonetim/before-after-actions";

const CARD_ASPECT = 1; // ProofCard images are square (1:1)

/* -------------------------------------------------------------------------- */
/* Crop picker: pick a file → crop 1:1 → hand a Blob (+ preview) to the parent */
/* -------------------------------------------------------------------------- */
function CropPick({
  label,
  previewUrl,
  onCropped,
  disabled,
}: {
  label: string;
  previewUrl: string | null;
  onCropped: (blob: Blob, url: string) => void;
  disabled?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/60">
        {label}
      </span>
      <div className="aspect-square w-24 overflow-hidden rounded-lg border border-ink-deep/10 bg-paper">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-body text-[11px] text-ink-soft/40">
            yok
          </div>
        )}
      </div>
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
        disabled={disabled}
        className="rounded-lg border border-ink-deep/20 px-3 py-1.5 font-body text-[11px] uppercase tracking-label text-ink-soft transition-colors hover:border-ink-deep hover:text-ink-deep disabled:opacity-50"
      >
        {previewUrl ? "Değiştir" : "Görsel seç"}
      </button>

      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          aspect={CARD_ASPECT}
          busy={false}
          onCancel={() => setCropSrc(null)}
          onConfirm={(blob) => {
            onCropped(blob, URL.createObjectURL(blob));
            setCropSrc(null);
          }}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Add form                                                                    */
/* -------------------------------------------------------------------------- */
function AddCard() {
  const router = useRouter();
  const [oncesi, setOncesi] = useState<{ blob: Blob; url: string } | null>(null);
  const [sonrasi, setSonrasi] = useState<{ blob: Blob; url: string } | null>(null);
  const [isim, setIsim] = useState("");
  const [yas, setYas] = useState("");
  const [sure, setSure] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const ready = !!oncesi && !!sonrasi && isim.trim().length > 0;

  const reset = () => {
    if (oncesi) URL.revokeObjectURL(oncesi.url);
    if (sonrasi) URL.revokeObjectURL(sonrasi.url);
    setOncesi(null);
    setSonrasi(null);
    setIsim("");
    setYas("");
    setSure("");
  };

  const submit = () => {
    if (!ready) return;
    setError(null);
    const fd = new FormData();
    fd.append("oncesi", oncesi!.blob, "oncesi.webp");
    fd.append("sonrasi", sonrasi!.blob, "sonrasi.webp");
    fd.append("isim", isim);
    fd.append("yas", yas);
    fd.append("sure", sure);
    startTransition(async () => {
      const res = await createBeforeAfter(fd);
      if (res.ok) {
        reset();
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <div className="rounded-xl border border-dashed border-ink-deep/20 bg-white p-5">
      <div className="mb-4 font-body text-[11px] uppercase tracking-label text-ink-soft/60">
        Yeni kart ekle
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <CropPick
          label="Öncesi"
          previewUrl={oncesi?.url ?? null}
          disabled={pending}
          onCropped={(blob, url) => {
            if (oncesi) URL.revokeObjectURL(oncesi.url);
            setOncesi({ blob, url });
          }}
        />
        <CropPick
          label="Sonrası"
          previewUrl={sonrasi?.url ?? null}
          disabled={pending}
          onCropped={(blob, url) => {
            if (sonrasi) URL.revokeObjectURL(sonrasi.url);
            setSonrasi({ blob, url });
          }}
        />
        <div className="flex min-w-[200px] flex-1 flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/60">
              İsim (zorunlu)
            </span>
            <input
              value={isim}
              onChange={(e) => setIsim(e.target.value)}
              placeholder="Mehmet"
              className="rounded-lg border border-ink-deep/15 bg-white px-3 py-2 font-body text-[14px] outline-none focus:border-gold"
            />
          </label>
          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1">
              <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/60">
                Yaş (ops.)
              </span>
              <input
                value={yas}
                onChange={(e) => setYas(e.target.value)}
                placeholder="34"
                className="rounded-lg border border-ink-deep/15 bg-white px-3 py-2 font-body text-[14px] outline-none focus:border-gold"
              />
            </label>
            <label className="flex flex-[2] flex-col gap-1">
              <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/60">
                Süre (ops.)
              </span>
              <input
                value={sure}
                onChange={(e) => setSure(e.target.value)}
                placeholder="bir öğle arası"
                className="rounded-lg border border-ink-deep/15 bg-white px-3 py-2 font-body text-[14px] outline-none focus:border-gold"
              />
            </label>
          </div>
          <p className="font-body text-[12px] text-ink-soft/50">
            Önizleme: {buildCaption(isim, yas, sure) || "—"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={!ready || pending}
          className="rounded-lg bg-ink-deep px-5 py-2.5 font-body text-[12px] uppercase tracking-label text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Ekleniyor…" : "Kart ekle"}
        </button>
        {error && <span className="font-body text-[12px] text-rose-700">{error}</span>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Existing card row                                                           */
/* -------------------------------------------------------------------------- */
function CardRow({
  row,
  isFirst,
  isLast,
}: {
  row: BeforeAfterRow;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [isim, setIsim] = useState(row.isim ?? "");
  const [yas, setYas] = useState(row.yas ?? "");
  const [sure, setSure] = useState(row.sure ?? "");

  const dirty =
    isim !== (row.isim ?? "") || yas !== (row.yas ?? "") || sure !== (row.sure ?? "");

  const run = (fn: () => Promise<{ ok: boolean; error: string | null }>) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  };

  const fdId = () => {
    const fd = new FormData();
    fd.append("id", row.id);
    return fd;
  };

  const move = (yon: "up" | "down") => {
    const fd = fdId();
    fd.append("yon", yon);
    run(() => moveBeforeAfter(fd));
  };

  const toggle = () => {
    const fd = fdId();
    fd.append("aktif", String(!row.aktif)); // flip current state
    run(() => toggleBeforeAfter(fd));
  };

  const saveText = () => {
    const fd = fdId();
    fd.append("isim", isim);
    fd.append("yas", yas);
    fd.append("sure", sure);
    run(() => updateBeforeAfterText(fd));
  };

  const del = () => run(() => deleteBeforeAfter(fdId()));

  const oncesiSrc = row.oncesi_path ? mediaSizeUrl(row.oncesi_path, 400) : "";
  const sonrasiSrc = row.sonrasi_path ? mediaSizeUrl(row.sonrasi_path, 400) : "";

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${
        row.aktif ? "border-ink-deep/10" : "border-ink-deep/10 opacity-60"
      }`}
    >
      <div className="flex flex-wrap items-start gap-4">
        {/* thumbnails */}
        <div className="flex gap-2">
          {[oncesiSrc, sonrasiSrc].map((src, i) => (
            <div
              key={i}
              className="aspect-square w-16 overflow-hidden rounded-md border border-ink-deep/10 bg-paper"
            >
              {src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          ))}
        </div>

        {/* text fields */}
        <div className="flex min-w-[200px] flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <input
              value={isim}
              onChange={(e) => setIsim(e.target.value)}
              placeholder="İsim"
              className="min-w-[120px] flex-1 rounded-md border border-ink-deep/15 bg-white px-2.5 py-1.5 font-body text-[13px] outline-none focus:border-gold"
            />
            <input
              value={yas}
              onChange={(e) => setYas(e.target.value)}
              placeholder="Yaş"
              className="w-16 rounded-md border border-ink-deep/15 bg-white px-2.5 py-1.5 font-body text-[13px] outline-none focus:border-gold"
            />
            <input
              value={sure}
              onChange={(e) => setSure(e.target.value)}
              placeholder="Süre"
              className="min-w-[120px] flex-1 rounded-md border border-ink-deep/15 bg-white px-2.5 py-1.5 font-body text-[13px] outline-none focus:border-gold"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-accent text-[13px] italic text-ink-soft/60">
              {buildCaption(isim, yas, sure) || "—"}
            </span>
            {dirty && (
              <button
                type="button"
                onClick={saveText}
                disabled={pending || !isim.trim()}
                className="rounded-md bg-ink-deep px-3 py-1 font-body text-[11px] uppercase tracking-label text-paper disabled:opacity-40"
              >
                Metni kaydet
              </button>
            )}
            {!row.aktif && (
              <span className="rounded bg-ink-deep/10 px-2 py-0.5 font-body text-[10px] uppercase tracking-label text-ink-soft/60">
                gizli
              </span>
            )}
          </div>
        </div>

        {/* controls */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Yukarı taşı"
              onClick={() => move("up")}
              disabled={pending || isFirst}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-deep/15 text-ink-soft transition-colors hover:border-ink-deep disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              aria-label="Aşağı taşı"
              onClick={() => move("down")}
              disabled={pending || isLast}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-deep/15 text-ink-soft transition-colors hover:border-ink-deep disabled:opacity-30"
            >
              ↓
            </button>
          </div>
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            className="rounded-md border border-ink-deep/15 px-3 py-1.5 font-body text-[11px] uppercase tracking-label text-ink-soft transition-colors hover:border-ink-deep disabled:opacity-40"
          >
            {row.aktif ? "Gizle" : "Göster"}
          </button>
          {confirmDel ? (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={del}
                disabled={pending}
                className="rounded-md bg-rose-600 px-3 py-1.5 font-body text-[11px] uppercase tracking-label text-white disabled:opacity-40"
              >
                Kalıcı sil
              </button>
              <button
                type="button"
                onClick={() => setConfirmDel(false)}
                disabled={pending}
                className="rounded-md border border-ink-deep/15 px-3 py-1.5 font-body text-[11px] text-ink-soft"
              >
                Vazgeç
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDel(true)}
              disabled={pending}
              className="rounded-md border border-rose-300 px-3 py-1.5 font-body text-[11px] text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-40"
            >
              Sil
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 font-body text-[12px] text-rose-700">{error}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Manager                                                                     */
/* -------------------------------------------------------------------------- */
export default function BeforeAfterManager({ items }: { items: BeforeAfterRow[] }) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div>
        <div className="font-body text-[11px] uppercase tracking-label text-ink-soft/60">
          Önce / Sonra kartları
        </div>
        <p className="mt-1 font-body text-[12px] text-ink-soft/50">
          Her kart 2 görsel (1:1) + isim, opsiyonel yaş/süre. Gizli kartlar
          carousel&apos;de görünmez ama silinmez. Sıralama ok tuşlarıyla.
        </p>
      </div>

      <AddCard />

      {items.length === 0 ? (
        <p className="rounded-lg border border-ink-deep/10 bg-white px-4 py-6 text-center font-body text-[13px] text-ink-soft/50">
          Henüz kart yok. Eklenene kadar sitede varsayılan örnekler gösterilir.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((row, i) => (
            <CardRow
              key={row.id}
              row={row}
              isFirst={i === 0}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
