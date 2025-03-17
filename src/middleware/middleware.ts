import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api/")) {
    const response = NextResponse.next();

    response.headers.set(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL || "*"
    );

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
