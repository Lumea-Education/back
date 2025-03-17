import { mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function initializeStorage(): Promise<void> {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await mkdir(path.join(UPLOAD_DIR, "resumes"), { recursive: true });
    await mkdir(path.join(UPLOAD_DIR, "cover-letters"), { recursive: true });
    console.log("File storage initialized successfully");
  } catch (error) {
    console.error("Failed to initialize file storage:", error);
    throw error;
  }
}

export function getUploadPath(fileType: string): string {
  switch (fileType.toLowerCase()) {
    case "resume":
      return path.join(UPLOAD_DIR, "resumes");
    case "coverletter":
      return path.join(UPLOAD_DIR, "cover-letters");
    default:
      return UPLOAD_DIR;
  }
}
