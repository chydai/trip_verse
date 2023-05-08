import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createChannel,
  getOwnedChannels,
  getJoinedChannels,
  getChannelById,
  joinChannel,
  quitChannel,
  transferChannel,
  removeMember,
  updateChannel,
  deleteChannel,
} from "../controllers/channel.js";

const router = express.Router();

router.post("/:groupId", verifyToken, createChannel);

router.get("/owned/:groupId", verifyToken, getOwnedChannels);
router.get("/joined/:groupId", verifyToken, getJoinedChannels);
router.get("/:id", verifyToken, getChannelById);

router.put("/join/:id", verifyToken, joinChannel);
router.put("/quit/:id", verifyToken, quitChannel);
router.put("/transfer/:id", verifyToken, transferChannel); // query params: targetId -> User._id
router.put("/remove/:id", verifyToken, removeMember); // query params: targetId -> User._id
router.put("/:id", verifyToken, updateChannel);

router.delete("/:id", verifyToken, deleteChannel);

export default router;
