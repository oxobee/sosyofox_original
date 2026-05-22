import { describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret } from "../src/lib/security/encryption";

describe("encryption", () => {
  it("round-trips secrets", () => {
    const encrypted = encryptSecret("secret-value");
    expect(encrypted).not.toContain("secret-value");
    expect(decryptSecret(encrypted)).toBe("secret-value");
  });
});
