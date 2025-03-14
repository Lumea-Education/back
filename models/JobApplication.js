const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
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
      trim: true,
    },
    resumePath: {
      type: String,
      required: true,
    },
    coverLetterPath: {
      type: String,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
    workAuthorization: {
      type: String,
      trim: true,
    },
    visaSponsorship: {
      type: String,
      trim: true,
    },
    referral: {
      type: String,
      trim: true,
    },
    referralName: {
      type: String,
      trim: true,
    },
    school: {
      type: String,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
    },
    positionName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
