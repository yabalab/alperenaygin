// Generates PWA icons from the brand logo (public/images/logo-aa.png).
// Cream background (#F4EFE6, brand `paper`) + the dark AA logo centered — matches
// how the logo reads on the site. Run: `node scripts/gen-pwa-icons.mjs`.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/images/logo-aa.png";
const OUT = "public/icons";
const CREAM = { r: 0xf4, g: 0xef, b: 0xe6, alpha: 1 }; // brand `paper`

async function make(size, logoFrac, file) {
  const box = Math.round(size * logoFrac);
  const logo = await sharp(SRC)
    .resize({ width: box, height: box, fit: "inside" })
    .toBuffer();
  const m = await sharp(logo).metadata();
  await sharp({
    create: { width: size, height: size, channels: 4, background: CREAM },
  })
    .composite([
      {
        input: logo,
        left: Math.round((size - m.width) / 2),
        top: Math.round((size - m.height) / 2),
      },
    ])
    .png()
    .toFile(`${OUT}/${file}`);
  console.log("wrote", `${OUT}/${file}`, `(${size}px, logo ${Math.round(logoFrac * 100)}%)`);
}

await mkdir(OUT, { recursive: true });
// "any" icons — moderate padding
await make(192, 0.72, "icon-192.png");
await make(512, 0.72, "icon-512.png");
// maskable — extra padding so nothing important is cropped by the safe-zone mask
await make(512, 0.56, "icon-maskable-512.png");
// iOS home-screen icon (apple-touch-icon)
await make(180, 0.72, "apple-touch-icon.png");
console.log("done");
