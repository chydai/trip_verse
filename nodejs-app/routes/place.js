import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
} from "../controllers/place.js";

const router = express.Router();

router.post("/:datePlanId", verifyToken, createPlace);

router.get("/all/:datePlanId", verifyToken, getAllPlaces);
router.get("/:id", verifyToken, getPlaceById);

router.put("/:id", verifyToken, updatePlace);

router.delete("/:id", verifyToken, deletePlace);

export default router;
