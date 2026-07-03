"use client";

import { createContext, useContext, Fragment, type ReactNode } from "react";
import { CONTENT_DEFAULTS } from "@/lib/cms/content";

const Ctx = createContext<Record<string, string>>(CONTENT_DEFAULTS);

export function ContentProvider({
  content,
  children,
}: {
  content: Record<string, string>;
  children: ReactNode;
}) {
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

/** Returns t(key) → the site text for a key (DB value or hardcoded fallback). */
export function useT() {
  const map = useContext(Ctx);
  return (key: string) => map[key] ?? CONTENT_DEFAULTS[key] ?? "";
}

/** Render a string with "\n" as line breaks. */
export function MultiLine({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}
