import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import path from "path";

// ✅ `__dirname` 해결 (ESM 환경)
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 환경 변수 로드
dotenv.config({ path: ".env.local" });

// ✅ 설정 및 유틸리티 가져오기
import { corsOptions } from "./config/cors.js";
import connectDB from "./config/db.js";
import { initializeUploadDirectories } from "./utils/file-helpers.js";

// ✅ MongoDB 연결
connectDB();

// ✅ 파일 업로드 디렉토리 초기화
initializeUploadDirectories();

const app = express();
const PORT = process.env.PORT || 5050; // 기본 포트 설정

const allowedOrigins = [
  "https://lumea-edu.org",
  "https://www.lumea-edu.org",
  "http://lumea-edu.org",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

// ✅ 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));

// ✅ 정적 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ 라우트 가져오기
import careersRouter from "./routes/careers.js";
import volunteerRouter from "./routes/volunteer.js";
import contactRouter from "./routes/contact.js";
import waitlistRouter from "./routes/waitlist.js";
import uploadRouter from "./routes/upload.js";
import oneDriveRouter from "./routes/one-drive.js";

app.use("/api/careers", careersRouter);
app.use("/api/volunteer", volunteerRouter);
app.use("/api/contact", contactRouter);
app.use("/api/waitlist", waitlistRouter);
app.use("/api", uploadRouter);
app.use("/api", oneDriveRouter);

// ✅ Health check 엔드포인트
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ✅ 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the backend API!" });
});

// ✅ 글로벌 에러 핸들러
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Global error handler:", err);
  res.status(500).json({ success: false, error: err.message });
});

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ MongoDB 연결 이벤트 로깅
mongoose.connection.on("connected", () => {
  const dbName = mongoose.connection.db?.databaseName || "Unknown";
  console.log(`✅ MongoDB connected! Current DB: ${dbName}`);
});
