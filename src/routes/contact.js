const express = require("express");
const router = express.Router();
const ContactRequest = require("../models/contact");

router.post("/", async (req, res) => {
  try {
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

    if (!name || !email || !phoneNumber || !inquiryType || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

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

    await contactRequest.save();

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
