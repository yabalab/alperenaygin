"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MediaRow } from "@/lib/cms/media";

const Ctx = createContext<Record<string, MediaRow>>({});

export function MediaProvider({
  media,
  children,
}: {
  media: Record<string, MediaRow>;
  children: ReactNode;
}) {
  return <Ctx.Provider value={media}>{children}</Ctx.Provider>;
}

/** Current media for an alan (null → site uses its hardcoded fallback image). */
export function useMedia(alan: string): MediaRow | null {
  return useContext(Ctx)[alan] ?? null;
}
