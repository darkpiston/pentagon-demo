import { NextResponse } from "next/server";
import { pentagonVerifyImageUrl } from "@/app/lib/apiEnvironment";

type VerifyImageBody = {
  imageUrl?: unknown;
  email?: unknown;
};

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.includes("@");
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyImageBody;

    if (typeof body.imageUrl !== "string" || !isValidUrl(body.imageUrl)) {
      return NextResponse.json(
        { error: "A valid imageUrl is required." },
        { status: 400 },
      );
    }

    if (typeof body.email !== "string" || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    const upstream = await fetch(pentagonVerifyImageUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: body.imageUrl,
        email: body.email.trim(),
      }),
    });

    const responseBody = await upstream.text();
    const contentType =
      upstream.headers.get("content-type") ?? "application/json";

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch {
    return NextResponse.json(
      { error: "Verification failed." },
      { status: 500 },
    );
  }
}
