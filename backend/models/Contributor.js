import mongoose from "mongoose";

const contributorSchema = new mongoose.Schema(
  {
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    username: { type: String, required: true },
    avatar: { type: String },
    contributions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

contributorSchema.index({ repositoryId: 1, username: 1 }, { unique: true });

export default mongoose.model("Contributor", contributorSchema);
