// Central GSAP entry — registers ScrollTrigger on the client only so SSR
// (Next 16 App Router) never touches window/document during render.
// Components use `useGSAP` (from @gsap/react) which scopes selectors and
// auto-reverts all animations/ScrollTriggers on unmount.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
