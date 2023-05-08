import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createComment,
  getCommentsByPlace,
  deleteComment
} from "../controllers/comment.js";

const router = express.Router();

router.post("/:placeId", verifyToken, createComment);

router.get("/:placeId", verifyToken, getCommentsByPlace);
router.delete("/:id", verifyToken, deleteComment);
// router.get("/:userId", verifyToken, getCommentsByUser);

export default router;
