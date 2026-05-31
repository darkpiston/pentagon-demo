import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const MAX_UPLOAD_BYTES = 2_097_152;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { detail: "A non-empty file is required." },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { detail: `File must be at most ${MAX_UPLOAD_BYTES} bytes.` },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { detail: "Content type is not allowed for image upload." },
        { status: 400 },
      );
    }

    const extension = file.type.split("/")[1] || "jpg";
    const imageUri = `https://example.blob.core.windows.net/user-verification/${randomUUID()}.${extension}`;

    return NextResponse.json(imageUri);
  } catch {
    return NextResponse.json(
      { detail: "Image upload failed." },
      { status: 500 },
    );
  }
}
