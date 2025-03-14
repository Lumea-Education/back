const mongoose = require("mongoose");

const ContactRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    areaCode: {
      type: String,
      trim: true,
    },
    inquiryType: {
      type: String,
      required: true,
      trim: true,
    },
    inquiryTitle: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ContactRequest", ContactRequestSchema);
