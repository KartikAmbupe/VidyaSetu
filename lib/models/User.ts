import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  role: { 
    type: String, 
    enum: ["parent", "child"],
    required: true 
  },
  
  // 1. For a CHILD document: This links the child back to their parent.
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    // Can be null if the user is a parent, or if this is the first parent account
  },
  
  // 2. 🟢 ADDED: For a PARENT document: This holds an array of IDs of their children.
  childrenIds: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
  }],


}, {
    timestamps: true // Good practice to track when documents were created/updated
});

export default mongoose.models.User || mongoose.model("User", userSchema);