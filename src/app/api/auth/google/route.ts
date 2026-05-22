import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

function appUrl(request: NextRequest) {
  return process.env.APP_URL ?? `${request.nextUrl.protocol}//${request.nextUrl.host}`;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "GOOGLE_CLIENT_ID eksik. Google OAuth aktif etmek için env girilmeli." }, { status: 503 });
  }

  const state = crypto.randomBytes(24).toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set("sosyofox_google_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600
  });

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${appUrl(request)}/api/auth/google/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(url);
}
