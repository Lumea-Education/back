import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import JobApplication from "../models/job";
import VolunteerApplication from "../models/volunteer";

const router = express.Router();

// ✅ 허용할 파일 유형 정의
const allowedFileTypes = [
  "application/pdf",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
];

// ✅ 업로드 디렉토리 설정
const uploadDir = path.join(__dirname, "../uploads");

// ----- Job Application Upload Handler ----- //
const jobUploadHandler: RequestHandler = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    if (!req.files || (!req.files.resume && !req.files.coverLetter)) {
      await res
        .status(400)
        .json({ success: false, message: "No files provided" });
      return;
    }

    // ✅ 파일 저장 디렉토리 설정
    const resumesDir = path.join(uploadDir, "resumes");
    const coverLettersDir = path.join(uploadDir, "cover-letters");

    let resumePath: string | null = null;
    let coverLetterPath: string | null = null;

    // ✅ 이력서 (Resume) 업로드 처리
    if (req.files.resume) {
      const resume = req.files.resume as any;

      // ✅ 파일 유형 검사
      if (!allowedFileTypes.includes(resume.mimetype)) {
        await res
          .status(400)
          .json({
            success: false,
            message: "Invalid file type. Only PDF, PNG, and DOCX are allowed.",
          });
        return;
      }

      const resumeFileName = `${uuidv4()}-${resume.name}`;
      resumePath = `/uploads/resumes/${resumeFileName}`;
      await resume.mv(path.join(resumesDir, resumeFileName));
    }

    // ✅ 커버레터 (Cover Letter) 업로드 처리
    if (req.files.coverLetter) {
      const coverLetter = req.files.coverLetter as any;

      // ✅ 파일 유형 검사
      if (!allowedFileTypes.includes(coverLetter.mimetype)) {
        await res
          .status(400)
          .json({
            success: false,
            message: "Invalid file type. Only PDF, PNG, and DOCX are allowed.",
          });
        return;
      }

      const coverLetterFileName = `${uuidv4()}-${coverLetter.name}`;
      coverLetterPath = `/uploads/cover-letters/${coverLetterFileName}`;
      await coverLetter.mv(path.join(coverLettersDir, coverLetterFileName));
    }

    // ✅ 지원서 데이터 업데이트
    const updatedApplication = await JobApplication.findByIdAndUpdate(
      applicationId,
      { resumePath, coverLetterPath },
      { new: true }
    );

    if (!updatedApplication) {
      await res
        .status(404)
        .json({ success: false, message: "Application not found" });
      return;
    }

    await res.status(201).json({
      success: true,
      message: "Files uploaded successfully",
      resumePath,
      coverLetterPath,
      updatedApplication,
    });
  } catch (error) {
    console.error("File Upload Error:", error);
    await res
      .status(500)
      .json({ success: false, message: "File upload failed" });
  }
};

// ----- Volunteer Upload Handler ----- //
const volunteerUploadHandler: RequestHandler = async (req, res, next) => {
  try {
    if (!req.files || !req.files.resume) {
      await res
        .status(400)
        .json({ success: false, message: "No file provided" });
      return;
    }

    const volunteerDir = path.join(uploadDir, "volunteer");
    const resume = req.files.resume as any;

    // ✅ 파일 유형 검사
    if (!allowedFileTypes.includes(resume.mimetype)) {
      await res
        .status(400)
        .json({
          success: false,
          message: "Invalid file type. Only PDF, PNG, and DOCX are allowed.",
        });
      return;
    }

    // ✅ 파일 저장 경로 설정
    const volunteerId = uuidv4();
    const resumeFileName = `${volunteerId}-${resume.name}`;
    const resumePath = `/uploads/volunteer/${resumeFileName}`;
    await resume.mv(path.join(volunteerDir, resumeFileName));

    // ✅ 지원자 데이터 저장
    const {
      firstName,
      lastName,
      email,
      countryCode,
      areaCode,
      number,
      positionName,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !countryCode ||
      !areaCode ||
      !number
    ) {
      await res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }

    const newVolunteer = new VolunteerApplication({
      firstName,
      lastName,
      email,
      phone: {
        countryCode,
        areaCode,
        number,
      },
      resumePath,
      positionName: positionName || "Not specified",
    });

    const savedVolunteer = await newVolunteer.save();

    await res.status(201).json({
      success: true,
      message: "Volunteer application submitted successfully",
      applicationId: savedVolunteer._id,
      resumePath,
    });
  } catch (error) {
    console.error("Volunteer Upload Error:", error);
    await res
      .status(500)
      .json({ success: false, message: "Volunteer upload failed" });
  }
};

// ----- Routes ----- //
// ✅ Job 지원서 파일 업로드 (이력서, 커버레터)
router.post("/careers/upload/:applicationId", jobUploadHandler);

// ✅ Volunteer 지원서 파일 업로드
router.post("/careers/volunteer/upload/:applicationId", volunteerUploadHandler);

export default router;
