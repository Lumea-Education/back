const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const JobApplication = require("../models/JobApplication"); // ✅ MongoDB 모델 추가

const router = express.Router();

// 업로드 경로 설정
const uploadDir = path.join(__dirname, "../uploads");
const resumesDir = path.join(uploadDir, "resumes");
const coverLettersDir = path.join(uploadDir, "cover-letters");

// 파일 업로드 API (이력서 & 커버레터)
router.post("/careers/upload/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;
    if (!applicationId) {
      return res
        .status(400)
        .json({ success: false, message: "Application ID is missing" });
    }

    if (!req.files || (!req.files.resume && !req.files.coverLetter)) {
      return res
        .status(400)
        .json({ success: false, message: "No files provided" });
    }

    let resumePath = null;
    let coverLetterPath = null;

    // 이력서 저장
    if (req.files.resume) {
      const resume = req.files.resume;
      const resumeFileName = `${uuidv4()}-${resume.name}`;
      resumePath = `/uploads/resumes/${resumeFileName}`;
      await resume.mv(path.join(resumesDir, resumeFileName));
    }

    // 커버레터 저장
    if (req.files.coverLetter) {
      const coverLetter = req.files.coverLetter;
      const coverLetterFileName = `${uuidv4()}-${coverLetter.name}`;
      coverLetterPath = `/uploads/cover-letters/${coverLetterFileName}`;
      await coverLetter.mv(path.join(coverLettersDir, coverLetterFileName));
    }

    // ✅ MongoDB 업데이트 (resumePath & coverLetterPath 추가)
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
    console.error("❌ File Upload Error:", error);
    res.status(500).json({ success: false, message: "File upload failed" });
  }
});

module.exports = router;
