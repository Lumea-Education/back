import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  resumePath: string;
  coverLetterPath?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  workAuthorization?: string;
  visaSponsorship?: string;
  referral?: string;
  referralName?: string;
  school?: string;
  degree?: string;
  positionName: string;
}

const JobApplicationSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
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
    phoneNumber: { type: String, trim: true },
    resumePath: { type: String, required: true },
    coverLetterPath: { type: String },
    linkedIn: { type: String, trim: true },
    github: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    workAuthorization: { type: String, trim: true },
    visaSponsorship: { type: String, trim: true },
    referral: { type: String, trim: true },
    referralName: { type: String, trim: true },
    school: { type: String, trim: true },
    degree: { type: String, trim: true },
    positionName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
