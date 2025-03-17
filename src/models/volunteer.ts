import mongoose, { Schema, Document } from "mongoose";

export interface IVolunteerApplication extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: {
    countryCode: string;
    areaCode: string;
    number: string;
  };
  resumePath: string;
  positionName: string;
}

const VolunteerApplicationSchema: Schema = new Schema(
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
    phone: {
      countryCode: { type: String, required: true },
      areaCode: { type: String, required: true },
      number: { type: String, required: true },
    },
    resumePath: { type: String, required: true },
    positionName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.VolunteerApplication ||
  mongoose.model<IVolunteerApplication>(
    "VolunteerApplication",
    VolunteerApplicationSchema
  );
