import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    timezone: {
      type: String,
      required: true,
      default: "UTC",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
