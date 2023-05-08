import { createError } from "../utils/error.js";
import Group from "../models/Group.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";

export const createGroup = async (req, res, next) => {
  const newGroup = new Group({ userId: req.user.id, ...req.body });
  newGroup.members.push(req.user.id);
  try {
    const savedGroup = await newGroup.save();
    res.status(200).json(savedGroup);
  } catch (err) {
    next(err);
  }
};

export const searchGroups = async (req, res, next) => {
  const query = req.query.name;
  try {
    const groups = await Group.find({
      name: { $regex: query, $options: "i" },
    });
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
};

export const getRandomGroups = async (req, res, next) => {
  try {
    const groups = await Group.aggregate([{ $sample: { size: 9 } }]);
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
};

export const getAllGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({});
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
};

export const getOwnedGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ userId: req.query.targetId });
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
};

export const getJoinedGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.query.targetId });
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
};

export const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) return next(createError(404, "Group not found"));
    if (!group.members.includes(req.user.id))
      return next(createError(400, "You do not join this group"));

    res.status(200).json(group);
  } catch (err) {
    next(err);
  }
};

export const joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) return next(createError(404, "Group not found"));
    if (group.members.includes(req.user.id))
      return next(createError(400, "You have already joined this group"));

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      {
        $push: { members: req.user.id },
      },
      { new: true }
    );
    res.status(200).json(updatedGroup);
  } catch (err) {
    next(err);
  }
};

export const quitGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) return next(createError(404, "Group not found"));
    if (!group.members.includes(req.user.id))
      return next(createError(400, "You do not join this group"));
    if (group.userId.equals(req.user.id))
      return next(createError(400, "You cannot quit the group that you owned"));

    const ownedChannelsInThisGroup = await Channel.find({
      userId: req.user.id,
      groupId: req.params.id,
    });
    if (ownedChannelsInThisGroup.length > 0)
      return next(
        createError(
          400,
          `You still own ${ownedChannelsInThisGroup.length} channels in this group. Please transfer them before you quit`
        )
      );

    await Channel.updateMany(
      { groupId: req.params.id, members: req.user.id },
      { $pull: { members: req.user.id } }
    );

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { members: req.user.id },
      },
      { new: true }
    );
    res.status(200).json(updatedGroup);
  } catch (err) {
    next(err);
  }
};

export const transferGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return next(createError(404, "Group not found"));

    if (group.userId.equals(req.user.id)) {
      const target = await User.findById(req.query.targetId);
      if (!target) return next(createError(404, "Target user not found"));
      if (!group.members.includes(target._id))
        return next(createError(400, "Target user is not in this group"));

      const updatedGroup = await Group.findByIdAndUpdate(
        req.params.id,
        {
          $set: { userId: target._id },
        },
        { new: true }
      );
      res.status(200).json(updatedGroup);
    } else {
      return next(
        createError(403, "You can only transfer the group owned by you")
      );
    }
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return next(createError(404, "Group not found"));

    if (group.userId.equals(req.user.id)) {
      const target = await User.findById(req.query.targetId);
      if (!target) return next(createError(404, "Target user not found"));
      if (target._id.equals(req.user.id))
        return next(createError(400, "You cannot remove yourself"));
      if (!group.members.includes(target._id))
        return next(createError(400, "Target user is not in this group"));

      const updatedGroup = await Group.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { members: target._id },
        },
        { new: true }
      );
      res.status(200).json(updatedGroup);
    } else {
      return next(
        createError(
          403,
          "You can only remove member from the group owned by you"
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

export const likeGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) return next(createError(404, "Group not found"));
    if (group.likes.includes(req.user.id))
      return next(createError(400, "You have already liked this group"));

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: req.user.id },
      },
      { new: true }
    );
    res.status(200).json(updatedGroup);
  } catch (err) {
    next(err);
  }
};

export const dislikeGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) return next(createError(404, "Group not found"));
    if (!group.likes.includes(req.user.id))
      return next(createError(400, "You have not liked this group yet"));

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user.id },
      },
      { new: true }
    );
    res.status(200).json(updatedGroup);
  } catch (err) {
    next(err);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return next(createError(404, "Group not found"));

    if (group.userId.equals(req.user.id)) {
      const updatedGroup = await Group.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedGroup);
    } else {
      return next(createError(403, "You can only update your group"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return next(createError(404, "Group not found"));

    if (group.userId.equals(req.user.id)) {
      await group.deleteOne();
      res.status(200).json("The group has been deleted");
    } else {
      return next(createError(403, "You can only delete your group"));
    }
  } catch (err) {
    next(err);
  }
};
