import mongoose, { Schema, Document } from "mongoose";

export interface IWaitlistEntry extends Document {
  name: string;
  email: string;
  phone: string;
}

const WaitlistEntrySchema: Schema = new Schema(
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
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.WaitlistEntry ||
  mongoose.model<IWaitlistEntry>("WaitlistEntry", WaitlistEntrySchema);
