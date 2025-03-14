import { mkdir } from "fs/promises";
import path from "path";

// Base directory for file uploads
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Initialize the upload directory structure
export async function initializeStorage() {
  try {
    // Create the main uploads directory if it doesn't exist
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Create subdirectories for different file types
    await mkdir(path.join(UPLOAD_DIR, "resumes"), { recursive: true });
    await mkdir(path.join(UPLOAD_DIR, "cover-letters"), { recursive: true });

    console.log("File storage initialized successfully");
  } catch (error) {
    console.error("Failed to initialize file storage:", error);
    throw error;
  }
}

// Get the appropriate directory for a specific file type
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
