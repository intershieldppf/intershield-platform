import { NextRequest, NextResponse } from "next/server";

import { verifyAdminAuthorization } from "@/lib/security/adminAuth";

export function proxy(request: NextRequest) {
  const result = verifyAdminAuthorization(request.headers.get("authorization"));

  if (result.authorized) return NextResponse.next();

  if (!result.configured) {
    return new NextResponse("Não encontrado.", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new NextResponse("Autenticação administrativa necessária.", {
    status: 401,
    headers: {
      "Cache-Control": "no-store",
      "WWW-Authenticate": 'Basic realm="InterShield Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
