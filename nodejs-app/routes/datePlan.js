import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createDatePlan,
  getAllDatePlans,
  getDatePlanById,
  updateDatePlan,
  deleteDatePlan,
} from "../controllers/datePlan.js";

const router = express.Router();

router.post("/:channelId", verifyToken, createDatePlan);

router.get("/all/:channelId", verifyToken, getAllDatePlans);
router.get("/:id", verifyToken, getDatePlanById);

router.put("/:id", verifyToken, updateDatePlan);

router.delete("/:id", verifyToken, deleteDatePlan);

export default router;
