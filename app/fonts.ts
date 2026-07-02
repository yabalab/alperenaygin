import { Fraunces, Instrument_Serif, Archivo } from "next/font/google";

// Display serif — used for headings. Reference uses weights ~360–480 with a
// slight optical/soft feel, italic + normal. Fraunces is a variable font so we
// expose the full range.
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

// Accent italic serif — used for the poetic sub-lines and the "→" glyph.
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

// Body / label sans — reference loads 300, 400, 500.
export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-archivo",
  display: "swap",
});
