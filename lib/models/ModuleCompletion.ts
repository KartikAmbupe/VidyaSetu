import mongoose from "mongoose";

const moduleCompletionSchema = new mongoose.Schema({
  childId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  subject: {
    type: String,
    required: true,
    enum: ['English Fun', 'Math Adventures']
  },
  moduleName: {
    type: String,
    required: true
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Create compound index to ensure one completion per module per child
moduleCompletionSchema.index({ childId: 1, subject: 1, moduleName: 1 }, { unique: true });

export default mongoose.models.ModuleCompletion ||
  mongoose.model("ModuleCompletion", moduleCompletionSchema);

