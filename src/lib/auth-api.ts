import { prisma } from "./prisma";
import crypto from "crypto";

/**
 * Constant-time comparison using SHA-256 hashing to prevent timing attacks
 * and safely handle mismatched lengths without throwing errors or leaking length.
 */
function safeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Validates an incoming request's API key.
 * Supports:
 * - Authorization: Bearer <key>
 * - x-api-key: <key>
 * - query parameter ?apiKey=<key> (useful for simple GET links)
 */
export async function validateApiKey(request: Request): Promise<boolean> {
  // 1. Resolve key from headers or URL parameters
  const url = new URL(request.url);
  const authHeader = request.headers.get("Authorization");
  const xApiKey = request.headers.get("x-api-key");
  const queryKey = url.searchParams.get("apiKey");

  let token = "";
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.substring(7).trim();
  } else if (xApiKey) {
    token = xApiKey.trim();
  } else if (queryKey) {
    token = queryKey.trim();
  }

  // Security Hardening: Mitigate CPU DoS by limiting max token length
  if (!token || token.length > 256) {
    return false;
  }

  // 2. Check Local Dev Token (BOM-safe comparison)
  const devToken = (process.env.DEV_AGENT_TOKEN || "").replace(/^\uFEFF/, "").trim();
  if (devToken && safeCompare(token, devToken)) {
    return true;
  }

  // 3. Hash the token and look up in the database
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const keyRecord = await prisma.apiKey.findUnique({
      where: { hash: tokenHash }
    });

    if (keyRecord && keyRecord.active) {
      // Background update lastUsed timestamp asynchronously
      prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsed: new Date() }
      }).catch((err) => console.error("Failed to update API key lastUsed:", err));

      return true;
    }
  } catch (error) {
    console.error("Database error validating API key:", error);
  }

  return false;
}
