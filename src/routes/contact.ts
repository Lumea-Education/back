import express, { Request, Response, RequestHandler } from "express";
import ContactRequest from "../models/contact.js";

const router = express.Router();

const contactPostHandler: RequestHandler = async (req, res) => {
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
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
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
};

router.post("/", contactPostHandler);

export default router;
