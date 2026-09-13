import { createHash, randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import {
  MERCADOLIVRE_OAUTH_COOKIE,
  getMercadoLivreConfig,
} from "@/lib/integrations/mercadolivre/config";
import { encryptMarketplaceSecret } from "@/lib/integrations/mercadolivre/crypto";
import { requireAdminRequest } from "@/lib/security/adminAuth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const { clientId, redirectUri } = getMercadoLivreConfig();
    const state = randomBytes(32).toString("base64url");
    const verifier = randomBytes(64).toString("base64url");
    const challenge = createHash("sha256").update(verifier).digest("base64url");
    const cookieValue = encryptMarketplaceSecret(
      JSON.stringify({ state, verifier, createdAt: Date.now() }),
      "mercadolivre:oauth-cookie",
    );

    const authorizationUrl = new URL("https://auth.mercadolivre.com.br/authorization");
    authorizationUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    }).toString();

    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set(MERCADOLIVRE_OAUTH_COOKIE, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
      ...(process.env.NODE_ENV === "production" ? { domain: ".intershield.com.br" } : {}),
    });
    return response;
  } catch {
    return Response.json(
      { error: "A integração do Mercado Livre ainda não está configurada." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
