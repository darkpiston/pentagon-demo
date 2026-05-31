/** Matches tribes-ios `APIEnvironment.baseURL`. */
export const TRIBES_API_BASE_URL =
  process.env.TRIBES_API_BASE_URL ??
  "https://tribes-f4d0dhare2csf4f3.westus2-01.azurewebsites.net/api";

/** Matches tribes-ios `UploadImageEndpoint.verificationImagePath`. */
export const VERIFICATION_IMAGE_PATH = "/media/verification-image";

/** Same-origin proxy route; forwards to tribes-service (avoids browser CORS). */
export const VERIFICATION_IMAGE_UPLOAD_URL = `/api${VERIFICATION_IMAGE_PATH}`;

export function tribesVerificationImageUrl(): string {
  return `${TRIBES_API_BASE_URL}${VERIFICATION_IMAGE_PATH}`;
}

/** Pentagon Azure Functions app (`tribesfunction`). */
export const PENTAGON_FUNCTIONS_BASE_URL =
  process.env.PENTAGON_FUNCTIONS_BASE_URL ??
  "https://tribesfunction.azurewebsites.net";

export const VERIFY_IMAGE_PATH = "/api/VerifyImage";

/** Same-origin proxy route; forwards to Pentagon VerifyImage (avoids browser CORS). */
export const VERIFY_IMAGE_PROXY_URL = "/api/pentagon/verify-image";

export function pentagonVerifyImageUrl(): string {
  return `${PENTAGON_FUNCTIONS_BASE_URL}${VERIFY_IMAGE_PATH}`;
}
