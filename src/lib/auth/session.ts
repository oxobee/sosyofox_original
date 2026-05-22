import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { getPrisma } from "@/lib/db/prisma";

const defaultCookieName = "sosyofox_session";
const sessionDays = 14;
type TemporaryUserPayload = { email?: string; fullName?: string; phone?: string };

function cookieName() {
  return process.env.SESSION_COOKIE_NAME ?? defaultCookieName;
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function sessionSecret() {
  return process.env.NEXTAUTH_SECRET ?? "sosyofox-bootstrap-development-secret";
}

function signBootstrapSession(email: string, expiresAt: number) {
  return crypto
    .createHmac("sha256", sessionSecret())
    .update(`${email}.${expiresAt}`)
    .digest("base64url");
}

function signTemporarySession(payload: string, expiresAt: number) {
  return crypto
    .createHmac("sha256", sessionSecret())
    .update(`${payload}.${expiresAt}`)
    .digest("base64url");
}

function encodeBootstrapSession(email: string, expiresAt: number) {
  return `bootstrap.${Buffer.from(email).toString("base64url")}.${expiresAt}.${signBootstrapSession(email, expiresAt)}`;
}

function encodeTemporaryUserSession(payload: { email: string; fullName: string; phone: string }, expiresAt: number) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `temp.${encodedPayload}.${expiresAt}.${signTemporarySession(encodedPayload, expiresAt)}`;
}

function decodeBootstrapSession(token: string) {
  const [prefix, emailRaw, expiresRaw, signature] = token.split(".");
  if (prefix !== "bootstrap" || !emailRaw || !expiresRaw || !signature) return null;

  const email = Buffer.from(emailRaw, "base64url").toString("utf8");
  const expiresAt = Number(expiresRaw);
  if (!email || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  const expected = signBootstrapSession(email, expiresAt);
  if (expected.length !== signature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;

  return { email, expiresAt };
}

function decodeTemporaryUserSession(token: string) {
  const [prefix, payloadRaw, expiresRaw, signature] = token.split(".");
  if (prefix !== "temp" || !payloadRaw || !expiresRaw || !signature) return null;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  const expected = signTemporarySession(payloadRaw, expiresAt);
  if (expected.length !== signature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;

  let payload: TemporaryUserPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadRaw, "base64url").toString("utf8")) as TemporaryUserPayload;
  } catch {
    return null;
  }
  if (!payload.email) return null;

  return {
    email: payload.email,
    fullName: payload.fullName ?? payload.email,
    phone: payload.phone ?? "",
    expiresAt
  };
}

export function bootstrapAdminEmail() {
  return (process.env.BOOTSTRAP_ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL ?? "mail.sosyofox@gmail.com").trim();
}

export function bootstrapAdminPassword() {
  return (process.env.BOOTSTRAP_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? "Ugur2803*").trim();
}

export async function createBootstrapAdminSession() {
  const expiresAt = Date.now() + sessionDays * 24 * 60 * 60 * 1000;
  const cookieStore = await cookies();
  cookieStore.set(cookieName(), encodeBootstrapSession(bootstrapAdminEmail(), expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt)
  });
}

export async function createTemporaryUserSession(payload: { email: string; fullName: string; phone: string }) {
  const expiresAt = Date.now() + sessionDays * 24 * 60 * 60 * 1000;
  const cookieStore = await cookies();
  cookieStore.set(cookieName(), encodeTemporaryUserSession(payload, expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt)
  });
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const requestHeaders = await headers();
  const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

  await getPrisma().session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      ipAddress: requestHeaders.get("x-forwarded-for")?.split(",")[0] ?? null,
      userAgent: requestHeaders.get("user-agent")
    }
  });

  const cookieStore = await cookies();
  cookieStore.set(cookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName())?.value;
  if (token && !token.startsWith("bootstrap.") && !token.startsWith("temp.")) {
    await getPrisma().session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(cookieName());
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName())?.value;
  if (!token) return null;

  const bootstrap = decodeBootstrapSession(token);
  if (bootstrap?.email === bootstrapAdminEmail()) {
    return {
      id: "bootstrap-admin",
      email: bootstrap.email,
      passwordHash: "",
      role: "ADMIN" as UserRole,
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        id: "bootstrap-admin-profile",
        userId: "bootstrap-admin",
        fullName: "Sosyofox Admin",
        phone: null,
        avatarUrl: null,
        themePreference: "DARK",
        adminNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      wallet: {
        id: "bootstrap-admin-wallet",
        userId: "bootstrap-admin",
        balance: 0,
        currency: "TRY",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  }

  const temporaryUser = decodeTemporaryUserSession(token);
  if (temporaryUser) {
    return {
      id: `temp-${temporaryUser.email}`,
      email: temporaryUser.email,
      passwordHash: "",
      role: "USER" as UserRole,
      status: "ACTIVE",
      emailVerifiedAt: null,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        id: `temp-profile-${temporaryUser.email}`,
        userId: `temp-${temporaryUser.email}`,
        fullName: temporaryUser.fullName,
        phone: temporaryUser.phone,
        avatarUrl: null,
        themePreference: "DARK",
        adminNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      wallet: {
        id: `temp-wallet-${temporaryUser.email}`,
        userId: `temp-${temporaryUser.email}`,
        balance: 0,
        currency: "TRY",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  }

  const session = await getPrisma().session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: {
        include: { profile: true, wallet: true }
      }
    }
  });

  if (!session || session.expiresAt < new Date() || session.user.status !== "ACTIVE") {
    return null;
  }

  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/panel");
  return user;
}

export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}
