// utils/fileHelpers.ts
import fs from "fs";
import path from "path";
import { Request } from "express";

export function initializeUploadDirectories(): void {
  const dirs = [
    path.join(__dirname, "../uploads"),
    path.join(__dirname, "../uploads/resumes"),
    path.join(__dirname, "../uploads/cover-letters"),
    path.join(__dirname, "../uploads/images"),
  ];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

export function getFileUrl(filePath: string, req: Request): string | null {
  if (!filePath) return null;
  const relativePath = filePath.replace(path.join(__dirname, ".."), "");
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}${relativePath.replace(/\\/g, "/")}`;
}

export function deleteFile(filePath: string): boolean {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}
