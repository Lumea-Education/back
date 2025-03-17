import mongoose, { Schema, Document } from "mongoose";

export interface IContactRequest extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  country?: string;
  areaCode?: string;
  inquiryType: string;
  inquiryTitle: string;
  message: string;
}

const ContactRequestSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
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
    phoneNumber: { type: String, required: true, trim: true },
    country: { type: String, trim: true },
    areaCode: { type: String, trim: true },
    inquiryType: { type: String, required: true, trim: true },
    inquiryTitle: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.ContactRequest ||
  mongoose.model<IContactRequest>("ContactRequest", ContactRequestSchema);
