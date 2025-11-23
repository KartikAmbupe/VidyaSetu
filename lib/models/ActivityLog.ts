import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activityType: String,
  score: Number,
  timeSpent: Number,
  dateCompleted: { type: Date, default: Date.now }
});

export default mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);
