import mongoose from "mongoose";

// Links a user to a repository they've analyzed — lets each user have their
// own "Saved Analyses" list without duplicating the cached repository data.
const savedAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

savedAnalysisSchema.index({ userId: 1, repositoryId: 1 }, { unique: true });

export default mongoose.model("SavedAnalysis", savedAnalysisSchema);
