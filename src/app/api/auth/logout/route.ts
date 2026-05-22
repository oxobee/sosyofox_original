import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";

function homeRedirect(request: Request) {
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}

export async function GET(request: Request) {
  await clearSession();
  return homeRedirect(request);
}

export async function POST(request: Request) {
  await clearSession();
  return homeRedirect(request);
}
