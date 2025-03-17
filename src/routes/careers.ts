import express, { Request, Response, RequestHandler } from "express";
import CareerApplication from "../models/job";

const router = express.Router();

const careersPostHandler: RequestHandler = async (req, res) => {
  console.log("🔍 [STEP 1] Received request at /api/careers:", req.body);

  const { firstName, lastName, email, positionName, resumePath } = req.body;

  if (!firstName || !lastName || !email) {
    console.log("❌ [STEP 2] Missing required fields:", req.body);
    res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
    return;
  }

  try {
    const newApplication = new CareerApplication({
      firstName,
      lastName,
      email,
      positionName: positionName || "Not specified",
      resumePath: resumePath || "pending_upload",
    });

    console.log(
      "🛠 [STEP 3] Attempting to save to MongoDB... 🚀",
      newApplication
    );

    const savedApplication = await newApplication.save();
    console.log(
      "✅ [STEP 4] Successfully saved to MongoDB! 🎉",
      savedApplication
    );

    res.status(201).json({
      success: true,
      applicationId: savedApplication._id,
    });
  } catch (error) {
    console.error("❌ [STEP 5] Error saving application:", error);
    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

router.post("/", careersPostHandler);

export default router;
