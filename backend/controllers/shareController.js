import { v4 as uuidv4 } from "uuid";
import Share from "../models/Share.js";
import Repository from "../models/Repository.js";
import Commit from "../models/Commit.js";
import Contributor from "../models/Contributor.js";

// POST /api/share  { repositoryId }
export const createShare = async (req, res, next) => {
  try {
    const { repositoryId } = req.body;
    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      const e = new Error("Repository not found");
      e.statusCode = 404;
      throw e;
    }

    const share = await Share.create({
      shareId: uuidv4(),
      repositoryId,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: { shareId: share.shareId } });
  } catch (err) {
    next(err);
  }
};

// GET /api/share/:id — public, no auth required
export const getSharedAnalysis = async (req, res, next) => {
  try {
    const share = await Share.findOne({ shareId: req.params.id }).populate(
      "repositoryId"
    );
    if (!share || !share.repositoryId) {
      const e = new Error("This share link is invalid or has expired");
      e.statusCode = 404;
      throw e;
    }

    const [commitCount, contributorCount] = await Promise.all([
      Commit.countDocuments({ repositoryId: share.repositoryId._id }),
      Contributor.countDocuments({ repositoryId: share.repositoryId._id }),
    ]);

    res.json({
      success: true,
      data: {
        ...share.repositoryId.toObject(),
        commitCount,
        contributorCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/share/:id
export const deleteShare = async (req, res, next) => {
  try {
    const result = await Share.findOneAndDelete({
      shareId: req.params.id,
      createdBy: req.user.id,
    });
    if (!result) {
      const e = new Error("Share link not found");
      e.statusCode = 404;
      throw e;
    }
    res.json({ success: true, message: "Share link deleted" });
  } catch (err) {
    next(err);
  }
};
