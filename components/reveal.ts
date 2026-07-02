import type { Variants } from "framer-motion";

/**
 * Reveal-on-scroll matching the reference's `.reveal` behaviour
 * (initReveal in dist/index.html): opacity 0→1, translateY(10px)→0,
 * 0.9s cubic-bezier(0.16,1,0.3,1), fired once at ~15% visibility.
 *
 * Spread `revealProps` onto any `motion.*` element to opt in.
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export const revealProps = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, amount: 0.15 },
  variants: revealVariants,
};
