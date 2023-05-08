import { createError } from "../utils/error.js";
import Post from "../models/Post.js";

export const createPost = async (req, res, next) => {
  const newPost = new Post({ userId: req.user.id, ...req.body });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    next(err);
  }
};

export const searchPosts = async (req, res, next) => {
  const query = req.query.title;
  try {
    const posts = await Post.find({
      title: { $regex: query, $options: "i" },
    }).limit(9);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const getRandomPosts = async (req, res, next) => {
  try {
    const posts = await Post.aggregate([{ $sample: { size: 9 } }]);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const getOwnedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.user.id });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found"));
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found"));
    if (post.likes.includes(req.user.id))
      return next(createError(400, "You have already liked this post"));

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { likes: req.user.id } },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
};

export const dislikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found"));
    if (!post.likes.includes(req.user.id))
      return next(createError(400, "You have not liked this post yet"));

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found"));

    if (post.userId.equals(req.user.id)) {
      await post.deleteOne();
      res.status(200).json("The post has been deleted");
    } else {
      return next(createError(403, "You can only delete your post"));
    }
  } catch (err) {
    next(err);
  }
};
