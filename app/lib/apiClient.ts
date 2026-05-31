import {
  VERIFICATION_IMAGE_UPLOAD_URL,
} from "./apiEnvironment";

const MAX_UPLOAD_BYTES = 2_097_152;

export async function uploadVerificationImage(image: File): Promise<string> {
  if (image.size === 0) {
    throw new Error("Please select an image to upload.");
  }

  if (image.size > MAX_UPLOAD_BYTES) {
    throw new Error("Your photo is too large. Please choose a smaller image.");
  }

  if (!image.type.startsWith("image/")) {
    throw new Error("The selected file must be an image.");
  }

  const formData = new FormData();
  formData.append("file", image, image.name || "verification.jpg");

  const response = await fetch(VERIFICATION_IMAGE_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const imageUri = await response.json();

  if (typeof imageUri !== "string" || imageUri.length === 0) {
    throw new Error("Verification upload failed.");
  }

  return imageUri;
}

async function readErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);

  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (typeof record.detail === "string") {
      return record.detail;
    }
    if (typeof record.message === "string") {
      return record.message;
    }
    if (typeof record.title === "string") {
      return record.title;
    }
  }

  return "Verification upload failed.";
}
