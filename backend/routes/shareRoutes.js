import express from "express";
import {
  createShare,
  getSharedAnalysis,
  deleteShare,
} from "../controllers/shareController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createShare);
router.get("/:id", getSharedAnalysis); // public
router.delete("/:id", protect, deleteShare);

export default router;
