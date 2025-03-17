const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const path = require("path");

// 환경 변수 로드
dotenv.config({ path: ".env.local" });

// 설정 및 유틸 불러오기
const { corsOptions } = require("./config/cors");
const connectDB = require("./config/db");
const { initializeUploadDirectories } = require("./utils/file-helpers");

// MongoDB 연결
connectDB();

// 파일 저장 디렉토리 초기화
initializeUploadDirectories();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));

// 정적 파일 서비스
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 라우트 설정
const careersRouter = require("./routes/careers");
const volunteerRouter = require("./routes/volunteer");
const contactRouter = require("./routes/contact");
const waitlistRouter = require("./routes/waitlist");
const uploadRouter = require("./routes/upload");
const oneDriveRouter = require("./routes/one-drive");

app.use("/api/careers", careersRouter);
app.use("/api/volunteer", volunteerRouter);
app.use("/api/contact", contactRouter);
app.use("/api/waitlist", waitlistRouter);
app.use("/api", uploadRouter);
app.use("/api", oneDriveRouter);

// 헬스 체크 엔드포인트
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend API!" });
});

// 글로벌 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ success: false, error: err.message });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// MongoDB 연결 이벤트 로깅
mongoose.connection.on("connected", () => {
  console.log(
    `✅ MongoDB 연결됨! 현재 DB: ${mongoose.connection.db.databaseName}`
  );
});
