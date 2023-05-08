import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) return next(createError(400, "This email has been registered"));

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong credentials"));

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};
