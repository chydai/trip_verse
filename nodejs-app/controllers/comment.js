import { createError } from "../utils/error.js";
import Place from "../models/Place.js";
import DatePlan from "../models/DatePlan.js";
import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const createComment = async (req, res, next) => {
    const newComment = new Comment({
        placeId: req.params.placeId,
        ...req.body,
    });
    try {
        const place = await Place.findById(req.params.placeId);
        if (!place) return next(createError(404, "Place not found"));

        const savedComment = await newComment.save();
        await Place.findByIdAndUpdate(req.params.placeId, {
            $push: { comments: savedComment._id },
        });
        res.status(200).json(savedComment);
    } catch (err) {
        next(err);
    }
};

export const getCommentsByPlace = async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.placeId);
        if (!place) return next(createError(404, "Place not found"));

        const comments = await Comment.find({ placeId: req.params.placeId });
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};

// export const getCommentsByUser = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) return next(createError(404, "User not found"));

//     const comments = await Comment.find({ userId: req.params.userId });
//     res.status(200).json(comments);
//   } catch (err) {
//     next(err);
//   }
// };

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return next(createError(404, "Comment not found"));

        if (String(comment.userId) !== req.user.id)
            return next(
                createError(403, "You can only delete your own comments!")
            );

        await comment.deleteOne();
        res.status(200).json("The comment has been deleted");
    } catch (err) {
        next(err);
    }
};
