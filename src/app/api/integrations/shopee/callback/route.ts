import { NextResponse } from "next/server";

import { decryptMarketplaceSecret } from "@/lib/integrations/mercadolivre/crypto";
import { exchangeShopeeAuthorizationCode } from "@/lib/integrations/shopee/client";
import { SHOPEE_OAUTH_COOKIE } from "@/lib/integrations/shopee/config";
import { saveShopeeTokens } from "@/lib/integrations/shopee/store";

export const runtime = "nodejs";

type OAuthState = { state: string; createdAt: number };

function statusPage(title: string, message: string, status = 200) {
  const body = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="font-family:Arial,sans-serif;max-width:640px;margin:64px auto;padding:24px;color:#111"><h1>${title}</h1><p>${message}</p><p>Você já pode fechar esta página.</p></body></html>`;
  return new NextResponse(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export async function GET(request: Request) {
  let stage = "request_validation";
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const shopIdValue = url.searchParams.get("shop_id");
  const oauthError = url.searchParams.get("error");
  const cookieValue = readCookie(request, SHOPEE_OAUTH_COOKIE);

  if (
    oauthError ||
    !code ||
    !state ||
    !shopIdValue ||
    !/^\d+$/.test(shopIdValue) ||
    !cookieValue
  ) {
    return statusPage(
      "Autorização não concluída",
      "Volte ao painel da InterShield e inicie a conexão novamente.",
      400,
    );
  }

  try {
    stage = "oauth_state_validation";
    const oauthState = JSON.parse(
      decryptMarketplaceSecret(decodeURIComponent(cookieValue), "shopee:oauth-cookie"),
    ) as OAuthState;
    if (oauthState.state !== state || Date.now() - oauthState.createdAt > 10 * 60_000) {
      return statusPage("Autorização expirada", "Inicie a conexão novamente.", 400);
    }

    stage = "token_exchange";
    const shopId = Number(shopIdValue);
    const tokens = await exchangeShopeeAuthorizationCode(code, shopId);

    stage = "token_storage";
    await saveShopeeTokens(tokens, shopId);
    const response = statusPage(
      "Shopee conectada",
      "A loja foi autorizada e os tokens foram armazenados de forma protegida.",
    );
    response.cookies.set(SHOPEE_OAUTH_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      ...(process.env.NODE_ENV === "production" ? { domain: ".intershield.com.br" } : {}),
    });
    return response;
  } catch (error) {
    console.error("Shopee OAuth callback failed", {
      stage,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return statusPage(
      "Falha ao conectar a Shopee",
      "A configuração não foi concluída. Revise as credenciais e tente novamente.",
      500,
    );
  }
}
