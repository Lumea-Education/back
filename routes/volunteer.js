const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const VolunteerApplication = require("../models/VolunteerApplication");

// Configure multer for file uploads
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only certain file types
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

// POST - Submit a volunteer application
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    console.log("Received request body:", req.body); // ✅ 이거 추가
    console.log("Received file:", req.file); // ✅ 이거 추가

    // Extract form data
    const { firstName, lastName, email, phoneNumber, positionName } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create a new volunteer application
    const volunteerApplication = new VolunteerApplication({
      firstName,
      lastName,
      email,
      phoneNumber,
      resumePath: req.file.path,
      positionName: positionName || "Not specified",
    });

    // Save to database
    await volunteerApplication.save();

    // Return success response
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
