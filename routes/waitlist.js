const express = require("express");
const router = express.Router();
const WaitlistEntry = require("../models/WaitlistEntry");

// POST - Submit a waitlist entry
router.post("/", async (req, res) => {
  try {
    // Extract form data
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if email already exists in waitlist
    const existingEntry = await WaitlistEntry.findOne({ email });
    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "Email already registered in waitlist",
      });
    }

    // Create a new waitlist entry
    const waitlistEntry = new WaitlistEntry({
      name,
      email,
      phone,
    });

    // Save to database
    await waitlistEntry.save();

    // Return success response
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
});

module.exports = router;
