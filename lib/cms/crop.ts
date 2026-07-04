// Produce a cropped webp Blob from an image + react-easy-crop's pixel area.
// Also caps output width (browser pre-shrink) so uploads stay small and under
// serverless limits; the server (sharp) then generates the responsive sizes.

export type PixelArea = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function getCroppedWebp(
  imageSrc: string,
  area: PixelArea,
  maxWidth = 1200
): Promise<Blob> {
  const img = await loadImage(imageSrc);
  const scale = Math.min(1, maxWidth / area.width);
  const w = Math.max(1, Math.round(area.width * scale));
  const h = Math.max(1, Math.round(area.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas yok");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, w, h);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("kırpma başarısız"))),
      "image/webp",
      0.9
    );
  });
}
