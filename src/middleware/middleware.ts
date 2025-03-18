import { Request, Response, NextFunction } from "express";

// CORS 헤더를 추가하는 미들웨어
export function middleware(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = [process.env.FRONTEND_URL || "*"];
  const origin = req.headers.origin || "";

  if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    // **Preflight 요청 처리** (OPTIONS 메서드일 경우 즉시 응답)
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
  }

  next();
}
