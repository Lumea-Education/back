import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fileUpload, { UploadedFile } from "express-fileupload";

const router = express.Router();
const UPLOAD_DIR = path.join(process.cwd(), "uploads/volunteers");

router.post("/", async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.resume) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const resume = req.files.resume as UploadedFile;
    const fileName = `${uuidv4()}-${resume.name}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await resume.mv(filePath);

    return res
      .status(201)
      .json({ success: true, message: "Resume uploaded", filePath });
  } catch (error) {
    console.error("Volunteer upload error:", error);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default router;
