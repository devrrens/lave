export type CompressImageOptions = {
  maxDimension?: number;
  quality?: number;
};

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

export async function compressImage(
  file: File,
  { maxDimension = 1600, quality = 0.8 }: CompressImageOptions = {}
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const hasAlpha = file.type === "image/png" || file.type === "image/webp";
    const candidates = hasAlpha ? ["image/webp", "image/png"] : ["image/webp", "image/jpeg"];

    for (const type of candidates) {
      const blob = await toBlob(canvas, type, quality);
      if (!blob || blob.size === 0) continue;
      if (scale === 1 && blob.size >= file.size) return file;
      const ext = type === "image/webp" ? "webp" : type === "image/png" ? "png" : "jpg";
      const base = file.name.replace(/\.[^.]+$/, "");
      return new File([blob], `${base}.${ext}`, { type });
    }
    return file;
  } catch {
    return file;
  }
}
