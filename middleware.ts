import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the request is for the API
  if (path.startsWith("/api/")) {
    // Add CORS headers to the response
    const response = NextResponse.next();

    // Allow requests from your frontend origin
    response.headers.set(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL || "*"
    );

    // Allow specific HTTP methods
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    // Allow specific headers
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Allow credentials (cookies, etc.)
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  }

  return NextResponse.next();
}

// Configure the middleware to run only for API routes
export const config = {
  matcher: "/api/:path*",
};
