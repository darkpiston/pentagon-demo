import {
  VERIFICATION_IMAGE_UPLOAD_URL,
  VERIFY_IMAGE_PROXY_URL,
} from "./apiEnvironment";
import { ImageScalingError, scaleImageToMaxSize } from "./imageScaling";

export type VerifyImageRequest = {
  imageUrl: string;
  email: string;
};

export async function uploadVerificationImage(image: File): Promise<string> {
  if (image.size === 0) {
    throw new Error("Please select an image to upload.");
  }

  if (!image.type.startsWith("image/")) {
    throw new Error("The selected file must be an image.");
  }

  let uploadFile = image;
  try {
    uploadFile = await scaleImageToMaxSize(image);
  } catch (error) {
    if (error instanceof ImageScalingError) {
      throw new Error(error.userMessage);
    }
    throw error;
  }

  const formData = new FormData();
  formData.append("file", uploadFile, uploadFile.name || "verification.jpg");

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
