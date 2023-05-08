import express from "express";
import {
  getUser,
  deleteUser,
  subscribe,
  unsubscribe,
  updateUser,
  rateUser,
} from "../controllers/user.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);

router.put("/sub/:userId", verifyToken, subscribe);
router.put("/unsub/:userId", verifyToken, unsubscribe);
router.put("/rate/:userId", verifyToken, rateUser);
router.put("/:id", verifyToken, updateUser);

router.delete("/:id", verifyToken, deleteUser);

export default router;
