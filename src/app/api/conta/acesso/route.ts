import { z } from "zod";

import {
  getSupabaseAdmin,
  isOrderStoreConfigured,
} from "@/lib/commerce/supabaseAdmin";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const accessSchema = z.object({
  email: z.email().trim().toLowerCase().max(180),
});

const genericResponse = {
  message:
    "Se este e-mail estiver vinculado a uma compra, enviaremos um acesso seguro.",
};

function resolveRedirectOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const url = new URL(configured || new URL(request.url).origin);

  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("Endereço público do site inválido.");
  }

  return url.origin;
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "customer-account-access", 5, 900_000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  if (!isOrderStoreConfigured()) {
    return Response.json(
      { error: "A área de pedidos ainda está em configuração." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(genericResponse, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const parsed = accessSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Informe um e-mail válido." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", parsed.data.email)
    .maybeSingle();

  if (customer) {
    const redirectOrigin = resolveRedirectOrigin(request);

    await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: {
        emailRedirectTo: `${redirectOrigin}/minha-conta`,
        shouldCreateUser: true,
      },
    });
  }

  return Response.json(genericResponse, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
