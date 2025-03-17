const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const VolunteerApplication = require("../models/volunteer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "../uploads/resumes");
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    cb(null, `volunteer-${uniqueId}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PDF and Word documents are allowed.")
      );
    }
  },
});

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received file:", req.file);

    const { firstName, lastName, email, phoneNumber, positionName } = req.body;

    if (!firstName || !lastName || !email || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const volunteerApplication = new VolunteerApplication({
      firstName,
      lastName,
      email,
      phoneNumber,
      resumePath: req.file.path,
      positionName: positionName || "Not specified",
    });

    await volunteerApplication.save();

    res.status(201).json({
      success: true,
      message: "Volunteer application submitted successfully",
      applicationId: volunteerApplication._id,
    });
    console.log("✅ Volunteer application saved successfully!");
  } catch (error) {
    console.error("Error submitting volunteer application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process volunteer application",
    });
  }
});

module.exports = router;
