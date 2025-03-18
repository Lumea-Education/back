import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Request } from "express";

// ✅ ESM 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 업로드 디렉토리 경로
const uploadDirs = [
  path.join(__dirname, "../uploads"),
  path.join(__dirname, "../uploads/resumes"),
  path.join(__dirname, "../uploads/cover-letters"),
  path.join(__dirname, "../uploads/volunteer"),
];

// ✅ 디렉토리가 없으면 생성하는 함수
export function initializeUploadDirectories() {
  for (const dir of uploadDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📂 Created directory: ${dir}`);
    }
  }
  console.log("✅ All upload directories are set up.");
}

// ✅ 업로드된 파일의 URL 반환
export function getFileUrl(filePath: string, req?: Request): string {
  if (!filePath) return "";

  // 요청(req)이 있다면 절대 URL 반환, 없으면 상대 경로 반환
  if (req) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}/uploads/${path.basename(filePath)}`;
  }

  return `/uploads/${path.basename(filePath)}`;
}

// ✅ 파일 삭제 함수
export function deleteFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Failed to delete file: ${filePath}`, error);
  }
}
