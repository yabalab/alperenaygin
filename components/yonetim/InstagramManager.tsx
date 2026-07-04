"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { InstagramRow } from "@/lib/cms/instagram";
import { mediaSizeUrl } from "@/lib/cms/media";
import CropModal from "./CropModal";
import {
  createInstagram,
  deleteInstagram,
  toggleInstagram,
  moveInstagram,
  updateInstagramLink,
} from "@/app/yonetim/instagram-actions";

const POST_ASPECT = 1; // Instagram band tiles are square (1:1)

/* -------------------------------------------------------------------------- */
/* Passive placeholder for the future Instagram Graph API integration.        */
/* Purely visual — nothing here is wired to any API or action.                */
/* -------------------------------------------------------------------------- */
function ApiPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative select-none overflow-hidden rounded-xl border border-dashed border-ink-deep/20 bg-ink-deep/[0.02] p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/50">
          Instagram&apos;dan Otomatik Çekme
        </span>
        <span className="rounded bg-ink-deep/10 px-2 py-0.5 font-body text-[10px] uppercase tracking-label text-ink-soft/50">
          Yakında
        </span>
      </div>

      {/* Disabled "connect" button */}
      <button
        type="button"
        disabled
        className="mb-4 cursor-not-allowed rounded-lg border border-ink-deep/15 bg-ink-deep/5 px-4 py-2.5 font-body text-[12px] uppercase tracking-label text-ink-soft/40"
      >
        Hesabı Bağla
      </button>

      {/* Greyed post grid preview with dead checkboxes */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-md border border-ink-deep/10 bg-ink-deep/[0.06]"
          >
            <span className="absolute left-1.5 top-1.5 flex items-center gap-1">
              <span className="h-3 w-3 rounded-[3px] border border-ink-deep/25 bg-white/50" />
            </span>
            <span className="absolute bottom-1.5 left-1.5 font-body text-[8px] uppercase tracking-label text-ink-soft/30">
              sitede göster
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 font-body text-[12px] leading-relaxed text-ink-soft/50">
        Instagram Graph API entegrasyonu ile son postlar otomatik çekilecek ve
        buradan seçilebilecek. Şu an manuel ekleme aktif.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Crop picker: pick a file → crop 1:1 → hand a Blob (+ preview) to the parent */
/* -------------------------------------------------------------------------- */
function CropPick({
  previewUrl,
  onCropped,
  disabled,
}: {
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
        Görsel
      </span>
      <div className="aspect-square w-24 overflow-hidden rounded-lg border border-ink-deep/10 bg-paper">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Görsel" className="h-full w-full object-cover" />
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
          aspect={POST_ASPECT}
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
function AddPost() {
  const router = useRouter();
  const [gorsel, setGorsel] = useState<{ blob: Blob; url: string } | null>(null);
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const ready = !!gorsel;

  const reset = () => {
    if (gorsel) URL.revokeObjectURL(gorsel.url);
    setGorsel(null);
    setLink("");
  };

  const submit = () => {
    if (!ready) return;
    setError(null);
    const fd = new FormData();
    fd.append("gorsel", gorsel!.blob, "gorsel.webp");
    fd.append("link", link);
    startTransition(async () => {
      const res = await createInstagram(fd);
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
        Yeni gönderi ekle (manuel)
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <CropPick
          previewUrl={gorsel?.url ?? null}
          disabled={pending}
          onCropped={(blob, url) => {
            if (gorsel) URL.revokeObjectURL(gorsel.url);
            setGorsel({ blob, url });
          }}
        />
        <div className="flex min-w-[220px] flex-1 flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/60">
              Instagram post linki (ops.)
            </span>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://instagram.com/p/…"
              className="rounded-lg border border-ink-deep/15 bg-white px-3 py-2 font-body text-[14px] outline-none focus:border-gold"
            />
          </label>
          <p className="font-body text-[12px] text-ink-soft/50">
            Görsel 1:1 kare kırpılır. Link boşsa profil sayfasına gider.
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
          {pending ? "Ekleniyor…" : "Gönderi ekle"}
        </button>
        {error && <span className="font-body text-[12px] text-rose-700">{error}</span>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Existing post row                                                           */
/* -------------------------------------------------------------------------- */
function PostRow({
  row,
  isFirst,
  isLast,
}: {
  row: InstagramRow;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [link, setLink] = useState(row.link ?? "");

  const dirty = link !== (row.link ?? "");

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
    run(() => moveInstagram(fd));
  };

  const toggle = () => {
    const fd = fdId();
    fd.append("aktif", String(!row.aktif));
    run(() => toggleInstagram(fd));
  };

  const saveLink = () => {
    const fd = fdId();
    fd.append("link", link);
    run(() => updateInstagramLink(fd));
  };

  const del = () => run(() => deleteInstagram(fdId()));

  const src = row.gorsel_path ? mediaSizeUrl(row.gorsel_path, 400) : "";

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${
        row.aktif ? "border-ink-deep/10" : "border-ink-deep/10 opacity-60"
      }`}
    >
      <div className="flex flex-wrap items-start gap-4">
        <div className="aspect-square w-16 shrink-0 overflow-hidden rounded-md border border-ink-deep/10 bg-paper">
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className="h-full w-full object-cover" />
          )}
        </div>

        <div className="flex min-w-[200px] flex-1 flex-col gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Instagram post linki (ops.)"
            className="w-full rounded-md border border-ink-deep/15 bg-white px-2.5 py-1.5 font-body text-[13px] outline-none focus:border-gold"
          />
          <div className="flex items-center gap-3">
            {dirty && (
              <button
                type="button"
                onClick={saveLink}
                disabled={pending}
                className="rounded-md bg-ink-deep px-3 py-1 font-body text-[11px] uppercase tracking-label text-paper disabled:opacity-40"
              >
                Linki kaydet
              </button>
            )}
            {!row.aktif && (
              <span className="rounded bg-ink-deep/10 px-2 py-0.5 font-body text-[10px] uppercase tracking-label text-ink-soft/60">
                gizli
              </span>
            )}
          </div>
        </div>

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
export default function InstagramManager({ items }: { items: InstagramRow[] }) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {/* Passive future-API placeholder (visual reminder only) */}
      <ApiPlaceholder />

      <div>
        <div className="font-body text-[11px] uppercase tracking-label text-ink-soft/60">
          Manuel gönderiler
        </div>
        <p className="mt-1 font-body text-[12px] text-ink-soft/50">
          Görsel (1:1) + opsiyonel post linki. Gizli gönderiler bantta görünmez
          ama silinmez. Sıralama ok tuşlarıyla.
        </p>
      </div>

      <AddPost />

      {items.length === 0 ? (
        <p className="rounded-lg border border-ink-deep/10 bg-white px-4 py-6 text-center font-body text-[13px] text-ink-soft/50">
          Henüz gönderi yok. Eklenene kadar bantta varsayılan örnekler gösterilir.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((row, i) => (
            <PostRow
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
