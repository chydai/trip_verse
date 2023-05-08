import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  settleUp,
  createDebt,
  getDebtByUser,
  getDebtById,
  deleteDebtByUser,
  deleteDebtById,
} from "../controllers/debt.js";

const router = express.Router();

router.put("/:id", verifyToken, settleUp);
router.get("/user/:userId", verifyToken, getDebtByUser); // query params: channelId -> Channel._id

// just for dev and test, not be used in practice
router.post("/", verifyToken, createDebt);

router.get("/:id", verifyToken, getDebtById);

router.delete("/user/:userId", verifyToken, deleteDebtByUser); // query params: channelId -> Channel._id
router.delete("/:id", verifyToken, deleteDebtById);

export default router;
