import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createGroup,
  searchGroups,
  getRandomGroups,
  getAllGroups,
  getOwnedGroups,
  getJoinedGroups,
  getGroupById,
  joinGroup,
  quitGroup,
  transferGroup,
  removeMember,
  likeGroup,
  dislikeGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/group.js";

const router = express.Router();

router.post("/", verifyToken, createGroup);

router.get("/search", searchGroups); // query params: name -> Group.name
router.get("/random", getRandomGroups);
router.get("/all", getAllGroups);

router.get("/owned", verifyToken, getOwnedGroups); // query params: targetId -> User._id
router.get("/joined", verifyToken, getJoinedGroups); // query params: targetId -> User._id
router.get("/:id", verifyToken, getGroupById);

router.put("/join/:id", verifyToken, joinGroup);
router.put("/quit/:id", verifyToken, quitGroup);
router.put("/transfer/:id", verifyToken, transferGroup); // query params: targetId -> User._id
router.put("/remove/:id", verifyToken, removeMember); // query params: targetId -> User._id
router.put("/like/:id", verifyToken, likeGroup);
router.put("/dislike/:id", verifyToken, dislikeGroup);
router.put("/:id", verifyToken, updateGroup);

router.delete("/:id", verifyToken, deleteGroup);

export default router;
