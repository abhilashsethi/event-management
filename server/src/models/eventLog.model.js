import mongoose from "mongoose";

const changeSchema = new mongoose.Schema(
  {
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const eventUpdateLogSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    changedByProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    changes: [changeSchema],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("EventUpdateLog", eventUpdateLogSchema);
