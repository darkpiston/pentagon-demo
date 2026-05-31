import {
  VERIFICATION_IMAGE_UPLOAD_URL,
  VERIFY_IMAGE_PROXY_URL,
} from "./apiEnvironment";

const MAX_UPLOAD_BYTES = 2_097_152;

export type VerifyImageRequest = {
  imageUrl: string;
  email: string;
};

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

export async function verifyImage(request: VerifyImageRequest): Promise<void> {
  const response = await fetch(VERIFY_IMAGE_PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageUrl: request.imageUrl,
      email: request.email,
    }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);

  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (typeof record.error === "string") {
      return record.error;
    }
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

  return "Verification failed.";
}
