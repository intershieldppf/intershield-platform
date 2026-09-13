import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey() {
  const encoded = process.env.MARKETPLACE_TOKEN_ENCRYPTION_KEY?.trim();
  if (!encoded) throw new Error("Marketplace token encryption is not configured");

  const key = /^[0-9a-f]{64}$/i.test(encoded)
    ? Buffer.from(encoded, "hex")
    : Buffer.from(encoded, "base64");

  if (key.length !== 32) {
    throw new Error("MARKETPLACE_TOKEN_ENCRYPTION_KEY must contain exactly 32 bytes");
  }

  return key;
}

export function encryptMarketplaceSecret(value: string, context: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  cipher.setAAD(Buffer.from(context));

  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return ["v1", iv.toString("base64url"), authTag.toString("base64url"), ciphertext.toString("base64url")].join(".");
}

export function decryptMarketplaceSecret(value: string, context: string) {
  const [version, ivValue, authTagValue, ciphertextValue] = value.split(".");
  if (version !== "v1" || !ivValue || !authTagValue || !ciphertextValue) {
    throw new Error("Invalid encrypted marketplace value");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivValue, "base64url"),
  );
  decipher.setAAD(Buffer.from(context));
  decipher.setAuthTag(Buffer.from(authTagValue, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
