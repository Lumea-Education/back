"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.middleware = void 0;
const server_1 = require("next/server");
function middleware(request) {
    const path = request.nextUrl.pathname;
    if (path.startsWith("/api/")) {
        const response = server_1.NextResponse.next();
        response.headers.set("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.headers.set("Access-Control-Allow-Credentials", "true");
        return response;
    }
    return server_1.NextResponse.next();
}
exports.middleware = middleware;
exports.config = {
    matcher: "/api/:path*",
};
