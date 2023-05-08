import { createError } from "../utils/error.js";
import Channel from "../models/Channel.js";
import Group from "../models/Group.js";
import User from "../models/User.js";

export const createChannel = async (req, res, next) => {
  const newChannel = new Channel({
    userId: req.user.id,
    groupId: req.params.groupId,
    ...req.body,
  });
  newChannel.members.push(req.user.id);
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return next(createError(404, "Group not found"));
    if (!group.members.includes(req.user.id))
      return next(createError(403, "You need to join this group first"));

    const savedChannel = await newChannel.save();
    res.status(200).json(savedChannel);
  } catch (err) {
    next(err);
  }
};

export const getOwnedChannels = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return next(createError(404, "Group not found"));
    if (!group.members.includes(req.user.id))
      return next(createError(403, "You need to join this group first"));

    const channels = await Channel.find({
      userId: req.user.id,
      groupId: req.params.groupId,
    });
    res.status(200).json(channels);
  } catch (err) {
    next(err);
  }
};

export const getJoinedChannels = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return next(createError(404, "Group not found"));
    if (!group.members.includes(req.user.id))
      return next(createError(403, "You need to join this group first"));

    const channels = await Channel.find({
      members: req.user.id,
      groupId: req.params.groupId,
    });
    res.status(200).json(channels);
  } catch (err) {
    next(err);
  }
};

export const getChannelById = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    res.status(200).json(channel);
  } catch (err) {
    next(err);
  }
};

export const joinChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) return next(createError(404, "Channel not found"));
    if (channel.members.includes(req.user.id))
      return next(createError(400, "You have already joined this channel"));

    const group = await Group.findById(channel.groupId);
    if (!group.members.includes(req.user.id))
      return next(createError(403, "You need to join this group first"));

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { members: req.user.id },
      },
      { new: true }
    );
    res.status(200).json(updatedChannel);
  } catch (err) {
    next(err);
  }
};

export const quitChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) return next(createError(404, "Channel not found"));
    if (!channel.members.includes(req.user.id))
      return next(createError(400, "You do not join this channel"));
    if (channel.userId.equals(req.user.id))
      return next(
        createError(400, "You cannot quit the channel that you owned")
      );

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { members: req.user.id },
      },
      { new: true }
    );
    res.status(200).json(updatedChannel);
  } catch (err) {
    next(err);
  }
};

export const transferChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return next(createError(404, "Channel not found"));

    if (channel.userId.equals(req.user.id)) {
      const target = await User.findById(req.query.targetId);
      if (!target) return next(createError(404, "Target user not found"));
      if (!channel.members.includes(target._id))
        return next(createError(400, "Target user is not in this channel"));

      const updatedChannel = await Channel.findByIdAndUpdate(
        req.params.id,
        {
          $set: { userId: target._id },
        },
        { new: true }
      );
      res.status(200).json(updatedChannel);
    } else {
      return next(
        createError(403, "You can only transfer the channel owned by you")
      );
    }
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return next(createError(404, "Channel not found"));

    if (channel.userId.equals(req.user.id)) {
      const target = await User.findById(req.query.targetId);
      if (!target) return next(createError(404, "Target user not found"));
      if (target._id.equals(req.user.id))
        return next(createError(400, "You cannot remove yourself"));
      if (!channel.members.includes(target._id))
        return next(createError(400, "Target user is not in this channel"));

      const updatedChannel = await Channel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { members: target._id },
        },
        { new: true }
      );
      res.status(200).json(updatedChannel);
    } else {
      return next(
        createError(
          403,
          "You can only remove member from the channel owned by you"
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

export const updateChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return next(createError(404, "Channel not found"));

    if (channel.userId.equals(req.user.id)) {
      const updatedChannel = await Channel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedChannel);
    } else {
      return next(createError(403, "You can only update your channel"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return next(createError(404, "Channel not found"));

    if (channel.userId.equals(req.user.id)) {
      await channel.deleteOne();
      res.status(200).json("The channel has been deleted");
    } else {
      return next(createError(403, "You can only delete your channel"));
    }
  } catch (err) {
    next(err);
  }
};
