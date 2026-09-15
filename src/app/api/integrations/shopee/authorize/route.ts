import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { createShopeeAuthorizationUrl } from "@/lib/integrations/shopee/client";
import { SHOPEE_OAUTH_COOKIE } from "@/lib/integrations/shopee/config";
import { encryptMarketplaceSecret } from "@/lib/integrations/mercadolivre/crypto";
import { requireAdminRequest } from "@/lib/security/adminAuth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const state = randomBytes(32).toString("base64url");
    const cookieValue = encryptMarketplaceSecret(
      JSON.stringify({ state, createdAt: Date.now() }),
      "shopee:oauth-cookie",
    );
    const response = NextResponse.redirect(createShopeeAuthorizationUrl(state));
    response.cookies.set(SHOPEE_OAUTH_COOKIE, cookieValue, {
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
      { error: "A integração da Shopee ainda não está configurada." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
