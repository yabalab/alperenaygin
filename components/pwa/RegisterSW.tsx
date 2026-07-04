"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (production only — avoids interfering with the
 * dev HMR/static pipeline). Rendered inside the panel layout so installing from
 * /yonetim gives a controlled, installable app.
 */
export default function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
