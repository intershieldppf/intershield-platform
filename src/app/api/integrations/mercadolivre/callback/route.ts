import { NextResponse } from "next/server";

import {
  MERCADOLIVRE_OAUTH_COOKIE,
  getMercadoLivreConfig,
} from "@/lib/integrations/mercadolivre/config";
import { decryptMarketplaceSecret } from "@/lib/integrations/mercadolivre/crypto";
import { saveMercadoLivreTokens } from "@/lib/integrations/mercadolivre/store";

export const runtime = "nodejs";

type OAuthState = { state: string; verifier: string; createdAt: number };

function statusPage(title: string, message: string, status = 200) {
  const body = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="font-family:Arial,sans-serif;max-width:640px;margin:64px auto;padding:24px;color:#111"><h1>${title}</h1><p>${message}</p><p>Você já pode fechar esta página.</p></body></html>`;
  return new NextResponse(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function GET(request: Request) {
  let stage = "request_validation";
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieValue = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${MERCADOLIVRE_OAUTH_COOKIE}=`))
    ?.slice(MERCADOLIVRE_OAUTH_COOKIE.length + 1);

  if (oauthError || !code || !state || !cookieValue) {
    return statusPage(
      "Autorização não concluída",
      "Volte ao painel da InterShield e inicie a conexão novamente.",
      400,
    );
  }

  try {
    stage = "oauth_state_validation";
    const oauthState = JSON.parse(
      decryptMarketplaceSecret(
        decodeURIComponent(cookieValue),
        "mercadolivre:oauth-cookie",
      ),
    ) as OAuthState;
    if (oauthState.state !== state || Date.now() - oauthState.createdAt > 10 * 60_000) {
      return statusPage("Autorização expirada", "Inicie a conexão novamente.", 400);
    }

    stage = "token_exchange";
    const { clientId, clientSecret, redirectUri } = getMercadoLivreConfig();
    const tokenResponse = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        code_verifier: oauthState.verifier,
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) throw new Error(`Token exchange failed (${tokenResponse.status})`);
    const tokens = (await tokenResponse.json()) as {
      access_token: string;
      token_type: string;
      expires_in: number;
      scope?: string;
      user_id: number;
      refresh_token?: string;
    };
    if (!tokens.access_token || !tokens.user_id || !tokens.expires_in) {
      throw new Error("Invalid Mercado Livre token response");
    }

    stage = "token_storage";
    await saveMercadoLivreTokens(tokens);
    const response = statusPage(
      "Mercado Livre conectado",
      "A conta foi autorizada e os tokens foram armazenados de forma protegida.",
    );
    response.cookies.set(MERCADOLIVRE_OAUTH_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      ...(process.env.NODE_ENV === "production" ? { domain: ".intershield.com.br" } : {}),
    });
    return response;
  } catch (error) {
    console.error("Mercado Livre OAuth callback failed", {
      stage,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return statusPage(
      "Falha ao conectar o Mercado Livre",
      "A configuração não foi concluída. Revise as credenciais e tente novamente.",
      500,
    );
  }
}
