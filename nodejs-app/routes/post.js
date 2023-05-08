import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createPost,
  searchPosts,
  getRandomPosts,
  getOwnedPosts,
  getPostById,
  likePost,
  dislikePost,
  deletePost,
} from "../controllers/post.js";

const router = express.Router();

router.post("/", verifyToken, createPost);

router.get("/search", searchPosts); // query params: title -> Post.title
router.get("/random", getRandomPosts);
router.get("/owned", verifyToken, getOwnedPosts);
router.get("/:id", getPostById);

router.put("/like/:id", verifyToken, likePost);
router.put("/dislike/:id", verifyToken, dislikePost);

router.delete("/:id", verifyToken, deletePost);

export default router;
