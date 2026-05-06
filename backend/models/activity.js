import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["lead_created", "lead_updated", "status_changed", "note_added", "lead_deleted"],
      default: "updated",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;