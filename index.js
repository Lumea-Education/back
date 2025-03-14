const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

// 환경 변수 로드
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 5050;

// 업로드 디렉토리 설정
const uploadDir = path.join(__dirname, "uploads");
const resumesDir = path.join(uploadDir, "resumes");
const coverLettersDir = path.join(uploadDir, "cover-letters");
const imagesDir = path.join(uploadDir, "images");

// 디렉토리 없으면 생성
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir);
if (!fs.existsSync(coverLettersDir)) fs.mkdirSync(coverLettersDir);
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

// 미들웨어 설정
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));

// MongoDB 연결
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 라우트 설정
app.use("/api/careers", require("./routes/careers"));
app.use("/api/volunteer", require("./routes/volunteer"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/waitlist", require("./routes/waitlist"));
app.use("/api", require("./routes/upload"));

// 서버 상태 확인 API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

mongoose.connection.on("connected", () => {
  console.log(
    `✅ MongoDB 연결됨! 현재 DB: ${mongoose.connection.db.databaseName}`
  );
});
