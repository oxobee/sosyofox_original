import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { credentialSchema } from "@/lib/validation/admin";
import { encryptSecret, secretHint } from "@/lib/security/encryption";
import { writeAuditLog } from "@/lib/audit/audit";

export async function POST(request: NextRequest) {
  const actor = await requireAdmin();
  const form = await request.formData();
  const providerName = String(form.get("providerName") ?? "wesosyal");
  const redirectUrl = new URL(providerName === "iyzico" ? "/admin/integrations?tab=payments" : "/admin/integrations", request.url);

  if (!hasDatabaseUrl()) {
    redirectUrl.searchParams.set("error", "database");
    return NextResponse.redirect(redirectUrl);
  }

  const payload = credentialSchema.safeParse({
    providerName: form.get("providerName"),
    apiKey: form.get("apiKey"),
    secretKey: form.get("secretKey") || undefined,
    baseUrl: form.get("baseUrl") || undefined
  });

  if (!payload.success) {
    redirectUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const prisma = getPrisma();
    const provider = await prisma.apiProvider.upsert({
      where: { name: payload.data.providerName },
      update: {
        baseUrl: payload.data.baseUrl || null,
        status: "ACTIVE"
      },
      create: {
        name: payload.data.providerName,
        displayName: payload.data.providerName === "wesosyal" ? "WeSosyal" : payload.data.providerName === "iyzico" ? "iyzico" : payload.data.providerName,
        baseUrl: payload.data.baseUrl || null,
        status: "ACTIVE"
      }
    });

    await prisma.apiCredential.updateMany({
      where: { providerId: provider.id },
      data: { isActive: false }
    });

    await prisma.apiCredential.create({
      data: {
        providerId: provider.id,
        label: "primary",
        encryptedValue: encryptSecret(payload.data.apiKey),
        keyHint: secretHint(payload.data.apiKey)
      }
    });

    if (payload.data.secretKey) {
      await prisma.integrationSetting.upsert({
        where: { key: `${payload.data.providerName}:secret` },
        update: { value: { encrypted: encryptSecret(payload.data.secretKey), hint: secretHint(payload.data.secretKey) } },
        create: { key: `${payload.data.providerName}:secret`, value: { encrypted: encryptSecret(payload.data.secretKey), hint: secretHint(payload.data.secretKey) } }
      });
    }

    await writeAuditLog({
      actorId: actor.id,
      action: "credential.saved",
      entity: "ApiProvider",
      entityId: provider.id,
      metadata: { provider: payload.data.providerName }
    });

    redirectUrl.searchParams.set("saved", payload.data.providerName);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    redirectUrl.searchParams.set("error", error instanceof Error ? error.message : "unknown");
    return NextResponse.redirect(redirectUrl);
  }
}
