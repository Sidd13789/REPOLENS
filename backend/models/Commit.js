import mongoose from "mongoose";

const fileChangeSchema = new mongoose.Schema(
  {
    filename: String,
    status: String, // added | modified | removed | renamed
    additions: Number,
    deletions: Number,
    changes: Number,
    patch: String,
  },
  { _id: false }
);

const commitSchema = new mongoose.Schema(
  {
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    sha: { type: String, required: true },
    message: { type: String },
    authorName: { type: String },
    authorLogin: { type: String },
    authorAvatar: { type: String },
    date: { type: Date, required: true },
    additions: { type: Number, default: 0 },
    deletions: { type: Number, default: 0 },
    filesChanged: { type: [fileChangeSchema], default: [] },
  },
  { timestamps: true }
);

commitSchema.index({ repositoryId: 1, sha: 1 }, { unique: true });
commitSchema.index({ repositoryId: 1, date: 1 });

export default mongoose.model("Commit", commitSchema);
