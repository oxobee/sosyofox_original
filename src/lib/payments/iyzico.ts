import { decryptSecret } from "@/lib/security/encryption";

export type IyzicoConfig = {
  apiKeyEncrypted?: string | null;
  secretKeyEncrypted?: string | null;
  baseUrl?: string | null;
};

export function createIyzicoClient(config: IyzicoConfig) {
  if (!config.apiKeyEncrypted || !config.secretKeyEncrypted) {
    throw new Error("iyzico API ayarları eksik.");
  }

  return {
    apiKey: decryptSecret(config.apiKeyEncrypted),
    secretKey: decryptSecret(config.secretKeyEncrypted),
    baseUrl: config.baseUrl ?? "https://sandbox-api.iyzipay.com"
  };
}

export function verifyIyzicoCallback(input: { status?: string; paymentId?: string; conversationId?: string }) {
  return Boolean(input.status && input.paymentId && input.conversationId);
}
