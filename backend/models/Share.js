import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    shareId: { type: String, required: true, unique: true },
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Share", shareSchema);
