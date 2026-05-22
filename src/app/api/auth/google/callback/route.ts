import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { createSession, createTemporaryUserSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleProfile = {
  email?: string;
  name?: string;
  picture?: string;
};

function appUrl(request: NextRequest) {
  return process.env.APP_URL ?? `${request.nextUrl.protocol}//${request.nextUrl.host}`;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("sosyofox_google_state")?.value;
  cookieStore.delete("sosyofox_google_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/login?error=google_state", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=google_config", request.url));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${appUrl(request)}/api/auth/google/callback`,
      grant_type: "authorization_code"
    }),
    cache: "no-store"
  });
  const token = (await tokenResponse.json()) as GoogleTokenResponse;
  if (!token.access_token || token.error) {
    return NextResponse.redirect(new URL("/login?error=google_token", request.url));
  }

  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { authorization: `Bearer ${token.access_token}` },
    cache: "no-store"
  });
  const profile = (await profileResponse.json()) as GoogleProfile;
  if (!profile.email) return NextResponse.redirect(new URL("/login?error=google_profile", request.url));

  if (!hasDatabaseUrl()) {
    await createTemporaryUserSession({
      email: profile.email.toLowerCase(),
      fullName: profile.name ?? profile.email,
      phone: ""
    });
    return NextResponse.redirect(new URL("/panel", request.url));
  }

  const prisma = getPrisma();
  const email = profile.email.toLowerCase();
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
      profile: {
        upsert: {
          update: { fullName: profile.name, avatarUrl: profile.picture },
          create: { fullName: profile.name, avatarUrl: profile.picture }
        }
      }
    },
    create: {
      email,
      passwordHash: await hashPassword(crypto.randomBytes(32).toString("base64url")),
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
      profile: { create: { fullName: profile.name, avatarUrl: profile.picture } },
      wallet: { create: { balance: 0 } }
    }
  });

  await createSession(user.id);
  return NextResponse.redirect(new URL(user.role === "ADMIN" ? "/admin" : "/panel", request.url));
}
