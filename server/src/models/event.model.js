import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    profileIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
      },
    ],
    timezone: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
