import express, { Request, Response, RequestHandler } from "express";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import VolunteerApplication from "../models/volunteer";

const router = express.Router();

const volunteerPostHandler: RequestHandler = async (req, res) => {
  const form = new formidable.IncomingForm({
    uploadDir: path.join(__dirname, "../uploads/resumes"),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      res
        .status(500)
        .json({ success: false, message: "Error processing request" });
      return;
    }

    const {
      firstName,
      lastName,
      email,
      countryCode,
      areaCode,
      number,
      positionName,
    } = fields;

    // ✅ 파일이 배열인지 확인하고 단일 파일을 가져옴
    const resumeFile = Array.isArray(files.resume)
      ? files.resume[0]
      : files.resume;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !countryCode ||
      !areaCode ||
      !number ||
      !resumeFile
    ) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }

    const resumePath = path.join("/uploads/resumes", resumeFile.newFilename);

    try {
      const volunteerApplication = new VolunteerApplication({
        firstName: firstName.toString(),
        lastName: lastName.toString(),
        email: email.toString(),
        phone: {
          countryCode: countryCode.toString(),
          areaCode: areaCode.toString(),
          number: number.toString(),
        },
        positionName: positionName ? positionName.toString() : "Not specified",
        resumePath,
      });

      await volunteerApplication.save();

      res.status(201).json({
        success: true,
        message: "Volunteer application submitted successfully",
        applicationId: volunteerApplication._id,
      });
      console.log("✅ Volunteer application saved successfully!");
    } catch (error) {
      console.error("Error saving volunteer application:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to process volunteer application",
        });
    }
  });
};

router.post("/", volunteerPostHandler);

export default router;
