import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import JobApplication from "../models/job.js";
import VolunteerApplication from "../models/volunteer.js";

const router = express.Router();

// ✅ 허용할 파일 유형 정의
const allowedFileTypes = [
  "application/pdf",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
];

// ✅ 업로드 디렉토리 설정
const uploadDir = path.join(__dirname, "../uploads");

// ----- 파일 저장 디렉토리 확인 및 생성 ----- //
const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ----- Job Application Upload Handler ----- //
const jobUploadHandler: RequestHandler = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    if (!req.files || (!req.files.resume && !req.files.coverLetter)) {
      return res
        .status(400)
        .json({ success: false, message: "No files provided" });
    }

    // ✅ 파일 저장 디렉토리 설정
    const resumesDir = path.join(uploadDir, "resumes");
    const coverLettersDir = path.join(uploadDir, "cover-letters");
    ensureDirectoryExists(resumesDir);
    ensureDirectoryExists(coverLettersDir);

    let resumePath: string | null = null;
    let coverLetterPath: string | null = null;

    // ✅ 이력서 (Resume) 업로드 처리
    if (req.files.resume) {
      const resume = req.files.resume as any;

      if (!allowedFileTypes.includes(resume.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Invalid file type. Only PDF, PNG, and DOCX are allowed.",
        });
      }

      const resumeFileName = `${uuidv4()}-${resume.name}`;
      resumePath = `/uploads/resumes/${resumeFileName}`;
      await resume.mv(path.join(resumesDir, resumeFileName));
    }

    // ✅ 커버레터 (Cover Letter) 업로드 처리
    if (req.files.coverLetter) {
      const coverLetter = req.files.coverLetter as any;

      if (!allowedFileTypes.includes(coverLetter.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Invalid file type. Only PDF, PNG, and DOCX are allowed.",
        });
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
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    return res.status(201).json({
      success: true,
      message: "Files uploaded successfully",
      resumePath,
      coverLetterPath,
      updatedApplication,
    });
  } catch (error) {
    console.error("File Upload Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "File upload failed" });
  }
};

// ----- Volunteer Upload Handler ----- //
const volunteerUploadHandler: RequestHandler = async (req, res, next) => {
  try {
    if (!req.files || !req.files.resume) {
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });
    }

    const volunteerDir = path.join(uploadDir, "volunteer");
    ensureDirectoryExists(volunteerDir);

    const resume = req.files.resume as any;

    if (!allowedFileTypes.includes(resume.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only PDF, PNG, and DOCX are allowed.",
      });
    }

    const volunteerId = uuidv4();
    const resumeFileName = `${volunteerId}-${resume.name}`;
    const resumePath = `/uploads/volunteer/${resumeFileName}`;
    await resume.mv(path.join(volunteerDir, resumeFileName));

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
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
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

    return res.status(201).json({
      success: true,
      message: "Volunteer application submitted successfully",
      applicationId: savedVolunteer._id,
      resumePath,
    });
  } catch (error) {
    console.error("Volunteer Upload Error:", error);
    return res
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
