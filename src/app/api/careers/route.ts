import express, { Request, Response } from "express";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fileUpload, { UploadedFile } from "express-fileupload";

const router = express.Router();
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// ✅ 파일 업로드 엔드포인트 (Express 버전)
router.post("/", async (req: Request, res: Response) => {
  try {
    // ✅ 파일 업로드 체크
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    // ✅ 업로드한 파일 저장할 ID 생성
    const applicationId = uuidv4();
    const applicationData: Record<string, any> = {};

    // ✅ 파일 업로드 처리
    const filePromises: Promise<void>[] = [];
    for (const [key, file] of Object.entries(req.files)) {
      const uploadedFile = file as UploadedFile;

      // ✅ 파일명 설정 (고유 ID + 원본 파일명)
      const fileName = `${applicationId}-${key}-${uploadedFile.name}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      // ✅ 파일 정보 저장
      applicationData[key] = {
        originalName: uploadedFile.name,
        storedPath: filePath,
        contentType: uploadedFile.mimetype,
        size: uploadedFile.size,
      };

      // ✅ 파일 저장 (비동기)
      const buffer = uploadedFile.data;
      filePromises.push(writeFile(filePath, buffer));
    }

    // ✅ 모든 파일 저장 완료될 때까지 대기
    await Promise.all(filePromises);

    console.log("Application received:", applicationData);

    // ✅ 성공 응답
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      applicationId,
    });
  } catch (error) {
    console.error("Error processing application:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process application",
    });
  }
});

export default router;
