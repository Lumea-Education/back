import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import JobApplication from "../models/job";

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");
const resumesDir = path.join(uploadDir, "resumes");
const coverLettersDir = path.join(uploadDir, "cover-letters");

router.post(
  "/careers/upload/:applicationId",
  async (req: Request, res: Response) => {
    try {
      const { applicationId } = req.params;
      if (!req.files || (!req.files.resume && !req.files.coverLetter)) {
        return res
          .status(400)
          .json({ success: false, message: "No files provided" });
      }
      let resumePath: string | null = null;
      let coverLetterPath: string | null = null;

      if (req.files.resume) {
        const resume = req.files.resume as any;
        const resumeFileName = `${uuidv4()}-${resume.name}`;
        resumePath = `/uploads/resumes/${resumeFileName}`;
        await resume.mv(path.join(resumesDir, resumeFileName));
      }
      if (req.files.coverLetter) {
        const coverLetter = req.files.coverLetter as any;
        const coverLetterFileName = `${uuidv4()}-${coverLetter.name}`;
        coverLetterPath = `/uploads/cover-letters/${coverLetterFileName}`;
        await coverLetter.mv(path.join(coverLettersDir, coverLetterFileName));
      }
      const updatedApplication = await JobApplication.findByIdAndUpdate(
        applicationId,
        { resumePath, coverLetterPath },
        { new: true }
      );
      if (!updatedApplication) {
        return res
          .status(404)
          .json({ success: false, message: "Application not found" });
      }
      res.status(201).json({
        success: true,
        message: "Files uploaded successfully",
        resumePath,
        coverLetterPath,
        updatedApplication,
      });
    } catch (error) {
      console.error("File Upload Error:", error);
      res.status(500).json({ success: false, message: "File upload failed" });
    }
  }
);

export default router;
