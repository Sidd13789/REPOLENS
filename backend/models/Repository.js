import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    owner: { type: String, required: true },
    name: { type: String, required: true },
    githubId: { type: Number },
    description: { type: String },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    watchers: { type: Number, default: 0 },
    openIssues: { type: Number, default: 0 },
    defaultBranch: { type: String, default: "main" },
    languages: { type: Map, of: Number, default: {} },
    githubCreatedAt: { type: Date },
    githubUpdatedAt: { type: Date },
    lastSyncedAt: { type: Date },
    lastSyncedCommitSha: { type: String },
    // First user who analyzed this repo (informational only — actual
    // per-user "saved" relationships live in SavedAnalysis so multiple
    // users can share one cached repository).
    analyzedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

repositorySchema.index({ owner: 1, name: 1 }, { unique: true });

export default mongoose.model("Repository", repositorySchema);
