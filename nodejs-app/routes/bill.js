import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
} from "../controllers/bill.js";

const router = express.Router();

router.post("/:datePlanId", verifyToken, createBill);

router.get("/all", verifyToken, getAllBills); // query params: channelId/datePlanId -> Channel._id/DatePlan._id
router.get("/:id", verifyToken, getBillById);

router.put("/:id", verifyToken, updateBill);

router.delete("/:id", verifyToken, deleteBill);

export default router;
