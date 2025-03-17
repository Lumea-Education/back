import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import JobApplication from "../models/job";
import VolunteerApplication from "../models/volunteer";

const router = express.Router();

// Common upload directory
const uploadDir = path.join(__dirname, "../uploads");

// ----- Job Application Upload Handler ----- //
const jobUploadHandler: RequestHandler = async (req, res, next) => {
  try {
    // This route expects a dynamic applicationId parameter in the URL
    const { applicationId } = req.params;
    if (!req.files || (!req.files.resume && !req.files.coverLetter)) {
      res.status(400).json({ success: false, message: "No files provided" });
      return;
    }

    // Define subdirectories for job application files
    const resumesDir = path.join(uploadDir, "resumes");
    const coverLettersDir = path.join(uploadDir, "cover-letters");

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
      res
        .status(404)
        .json({ success: false, message: "Application not found" });
      return;
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
};

// ----- Volunteer Upload Handler ----- //
const volunteerUploadHandler: RequestHandler = async (req, res, next) => {
  try {
    if (!req.files || !req.files.resume) {
      res.status(400).json({ success: false, message: "No file provided" });
      return;
    }
    const volunteerDir = path.join(uploadDir, "volunteer");
    const resume = req.files.resume as any;
    const volunteerId = uuidv4();
    const resumeFileName = `${volunteerId}-${resume.name}`;
    const resumePath = `/uploads/volunteer/${resumeFileName}`;
    await resume.mv(path.join(volunteerDir, resumeFileName));

    // Extract detailed contact info from req.body
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
      res
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

    res.status(201).json({
      success: true,
      message: "Volunteer application submitted successfully",
      applicationId: savedVolunteer._id,
      resumePath,
    });
  } catch (error) {
    console.error("Volunteer Upload Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Volunteer upload failed" });
  }
};

// Routes
// For job applications, the route contains a dynamic parameter (applicationId)
router.post("/careers/upload/:applicationId", jobUploadHandler);
// For volunteer applications, we use a distinct route (e.g., /careers/volunteer/upload)
router.post("/careers/volunteer/upload/:applicationId", volunteerUploadHandler);

export default router;
