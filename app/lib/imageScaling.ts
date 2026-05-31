/** tribes-service `MediaBlob:MaxUploadBytes` (2 MiB). */
export const MAX_UPLOAD_BYTES = 2_097_152;

const JPEG_QUALITIES = [0.85, 0.7, 0.55, 0.4, 0.25] as const;
const MIN_LONG_EDGE = 640;
const DIMENSION_SCALE = 0.85;

export type ImageScalingReason = "encodingFailed" | "exceedsMaxSize";

export class ImageScalingError extends Error {
  readonly reason: ImageScalingReason;

  constructor(reason: ImageScalingReason) {
    super(reason);
    this.name = "ImageScalingError";
    this.reason = reason;
  }

  get userMessage(): string {
    switch (this.reason) {
      case "exceedsMaxSize":
        return "Your photo is too large. Please choose a smaller image.";
      case "encodingFailed":
        return "We couldn't prepare your photo. Please try another image.";
    }
  }
}

export async function scaleImageToMaxSize(
  file: File,
  maxBytes = MAX_UPLOAD_BYTES,
): Promise<File> {
  if (file.size <= maxBytes) {
    return file;
  }

  const bitmap = await loadImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;

  try {
    while (true) {
      for (const quality of JPEG_QUALITIES) {
        const blob = await encodeJpeg(bitmap, width, height, quality);
        if (blob && blob.size <= maxBytes) {
          return new File([blob], "verification.jpg", { type: "image/jpeg" });
        }
      }

      const longEdge = Math.max(width, height);
      if (longEdge <= MIN_LONG_EDGE) {
        throw new ImageScalingError("exceedsMaxSize");
      }

      width = Math.max(1, Math.round(width * DIMENSION_SCALE));
      height = Math.max(1, Math.round(height * DIMENSION_SCALE));
    }
  } finally {
    bitmap.close();
  }
}

async function loadImageBitmap(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new ImageScalingError("encodingFailed");
  }
}

function encodeJpeg(
  source: ImageBitmap,
  width: number,
  height: number,
  quality: number,
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return Promise.reject(new ImageScalingError("encodingFailed"));
  }

  context.drawImage(source, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      "image/jpeg",
      quality,
    );
  });
}
