import { createError } from "../utils/error.js";
import User from "../models/User.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    const cur = await User.findById(req.user.id);
    const target = await User.findById(req.params.userId);

    if (cur._id.equals(target._id))
      return next(createError(400, "You cannot subscribe yourself"));
    if (cur.following.includes(target._id))
      return next(createError(400, "You have already subscribed this user"));

    await User.findByIdAndUpdate(req.user.id, {
      $push: { following: target._id },
    });
    await User.findByIdAndUpdate(req.params.userId, {
      $push: { followers: cur._id },
    });
    res.status(200).json("Successfully subscribed");
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const cur = await User.findById(req.user.id);
    const target = await User.findById(req.params.userId);

    if (cur._id.equals(target._id))
      return next(createError(400, "You cannot unsubscribe yourself"));
    if (!cur.following.includes(target._id))
      return next(createError(400, "You do not subscribe this user"));

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: target._id },
    });
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { followers: cur._id },
    });
    res.status(200).json("Successfully unsubscribed");
  } catch (err) {
    next(err);
  }
};

export const rateUser = async (req, res, next) => {
  try {
    const cur = await User.findById(req.user.id);
    const target = await User.findById(req.params.userId);

    if(!target)
      return next(createError(404, "Target user not found"));
    if (cur._id.equals(target._id))
      return next(createError(400, "You cannot rate yourself"));
    
    const newRating = ((target.rating * target.comments.length + req.body.rating) / (target.comments.length + 1)).toFixed(2);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {rating: newRating},
        $push: {comments: req.body.comment},
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    next(createError(403, "You can update only your account"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const user = await User.findById(req.params.id);
      await user.deleteOne();
      res.status(200).json("User has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    next(createError(403, "You can delete only your account"));
  }
};
