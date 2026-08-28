import { timingSafeEqual } from "node:crypto";

type AdminAuthResult =
  | { authorized: true }
  | { authorized: false; configured: boolean };

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminAuthorization(
  authorizationHeader: string | null,
): AdminAuthResult {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return { authorized: false, configured: false };
  }

  if (!authorizationHeader?.startsWith("Basic ")) {
    return { authorized: false, configured: true };
  }

  try {
    const decoded = Buffer.from(
      authorizationHeader.slice("Basic ".length),
      "base64",
    ).toString("utf8");
    const separator = decoded.indexOf(":");

    if (separator < 0) return { authorized: false, configured: true };

    const receivedUsername = decoded.slice(0, separator);
    const receivedPassword = decoded.slice(separator + 1);

    return {
      authorized:
        safeEqual(receivedUsername, username) &&
        safeEqual(receivedPassword, password),
      configured: true,
    };
  } catch {
    return { authorized: false, configured: true };
  }
}

export function requireAdminRequest(request: Request): Response | null {
  const result = verifyAdminAuthorization(request.headers.get("authorization"));

  if (result.authorized) return null;

  if (!result.configured) {
    return Response.json({ error: "Não encontrado." }, { status: 404 });
  }

  return Response.json(
    { error: "Acesso administrativo não autorizado." },
    {
      status: 401,
      headers: {
        "Cache-Control": "no-store",
        "WWW-Authenticate": 'Basic realm="InterShield Admin", charset="UTF-8"',
      },
    },
  );
}
