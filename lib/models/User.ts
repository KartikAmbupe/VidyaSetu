import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  role: { type: String, enum: ["parent", "child"] },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
