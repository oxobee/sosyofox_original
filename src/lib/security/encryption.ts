import crypto from "node:crypto";

const algorithm = "aes-256-gcm";

function getKey() {
  const value = process.env.ENCRYPTION_KEY;
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ENCRYPTION_KEY is required in production.");
    }
    return crypto.createHash("sha256").update("sosyofox-local-development-key").digest();
  }

  const base64 = Buffer.from(value, "base64");
  if (base64.length === 32) return base64;
  return crypto.createHash("sha256").update(value).digest();
}

export function encryptSecret(plainText: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(".");
}

export function decryptSecret(payload: string) {
  const [ivRaw, tagRaw, encryptedRaw] = payload.split(".");
  if (!ivRaw || !tagRaw || !encryptedRaw) throw new Error("Invalid encrypted payload.");

  const decipher = crypto.createDecipheriv(algorithm, getKey(), Buffer.from(ivRaw, "base64"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedRaw, "base64")),
    decipher.final()
  ]).toString("utf8");
}

export function secretHint(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}
