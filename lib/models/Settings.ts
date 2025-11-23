import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dailyTimeLimit: { type: Number, default: 30 },       // minutes
  cooldownPeriod: { type: Number, default: 30 },       // minutes
  currentSessionStart: { type: Number, default: null }, // timestamp of when the child entered the dashboard
  lastTimeCheckDate: { type: Date, default: Date.now }, // New field for daily reset logic
});

export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
