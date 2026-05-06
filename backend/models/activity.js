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
      enum: ["created", "updated", "status_changed", "note_added"],
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