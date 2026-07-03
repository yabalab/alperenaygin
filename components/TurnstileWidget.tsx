"use client";

import { useEffect, useRef } from "react";

// Minimal Cloudflare Turnstile wrapper (explicit render) so it works inside the
// dynamically-mounted booking modal. Calls onToken with the solved token (or ""
// on error/expiry). Renders nothing if no site key is configured.

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: Record<string, unknown>
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export default function TurnstileWidget({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const doRender = () => {
      if (cancelled || !ref.current || !window.turnstile) return;
      if (widgetId.current) return;
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        appearance: "interaction-only", // least intrusive
        theme: "dark",
        callback: (token: string) => onToken(token),
        "error-callback": () => onToken(""),
        "expired-callback": () => onToken(""),
      });
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = doRender;
      document.head.appendChild(s);
    } else {
      doRender();
    }

    // If the script is present but not ready yet, poll briefly.
    const poll = window.setInterval(() => {
      if (window.turnstile) {
        doRender();
        window.clearInterval(poll);
      }
    }, 200);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          // widget already gone
        }
        widgetId.current = null;
      }
    };
  }, [siteKey, onToken]);

  return <div ref={ref} />;
}
