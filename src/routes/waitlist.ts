import express, { Request, Response, RequestHandler } from "express";
import WaitlistEntry from "../models/wait.js";

const router = express.Router();

const waitlistPostHandler: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
    }

    const existingEntry = await WaitlistEntry.findOne({ email });
    if (existingEntry) {
      res.status(400).json({
        success: false,
        message: "Email already registered in waitlist",
      });
      return;
    }

    const waitlistEntry = new WaitlistEntry({
      name,
      email,
      phone,
    });

    await waitlistEntry.save();

    res.status(201).json({
      success: true,
      message: "Added to waitlist successfully",
      entryId: waitlistEntry._id,
    });
  } catch (error) {
    console.error("Error submitting waitlist entry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process waitlist entry",
    });
  }
};

router.post("/", waitlistPostHandler);

export default router;
