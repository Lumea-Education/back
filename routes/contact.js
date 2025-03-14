const express = require("express");
const router = express.Router();
const ContactRequest = require("../models/ContactRequest");

// POST - Submit a contact request
router.post("/", async (req, res) => {
  try {
    // Extract form data
    const {
      name,
      email,
      phoneNumber,
      country,
      areaCode,
      inquiryType,
      inquiryTitle,
      message,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !inquiryType || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create a new contact request
    const contactRequest = new ContactRequest({
      name,
      email,
      phoneNumber,
      country,
      areaCode,
      inquiryType,
      inquiryTitle,
      message,
    });

    // Save to database
    await contactRequest.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: "Contact request submitted successfully",
      requestId: contactRequest._id,
    });
  } catch (error) {
    console.error("Error submitting contact request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process contact request",
    });
  }
});

module.exports = router;
