import { createError } from "../utils/error.js";
import Debt from "../models/Debt.js";
import Channel from "../models/Channel.js";
import User from "../models/User.js";

export const settleUp = async (req, res, next) => {
  try {
    const debt = await Debt.findById(req.params.id);
    if (!debt) return next(createError(404, "Debt not found"));
    if (!debt.userId.equals(req.user.id))
      return next(createError(403, "You can only settle up your debt"));

    await debt.updateOne({ $set: { settled: req.body.settled } });
    const updatedDebt = await Debt.findById(req.params.id);
    res.status(200).json(updatedDebt);
  } catch (err) {
    next(err);
  }
};

export const createDebt = async (req, res, next) => {
  const newDebt = new Debt({ userId: req.user.id, ...req.body });
  newDebt.balance = newDebt.balance.toFixed(2);

  try {
    const channel = await Channel.findById(req.body.channelId);
    if (!channel) return next(createError(404, "Channel not found"));

    const target = await User.findById(req.body.targetId);
    if (!target) return next(createError(404, "Target User not found"));

    const savedDebt = await newDebt.save();
    res.status(200).json(savedDebt);
  } catch (err) {
    next(err);
  }
};

export const getDebtByUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(createError(404, "User not found"));
    if (!user._id.equals(req.user.id))
      return next(createError(403, "You can only view your debt"));

    if (req.query.channelId) {
      const channel = await Channel.findById(req.query.channelId);
      if (!channel) return next(createError(404, "Channel not found"));
    }

    const debts = req.query.channelId
      ? await Debt.find({
          userId: req.params.userId,
          channelId: req.query.channelId,
        })
      : await Debt.find({ userId: req.params.userId });
    res.status(200).json(debts);
  } catch (err) {
    next(err);
  }
};

export const getDebtById = async (req, res, next) => {
  try {
    const debt = await Debt.findById(req.params.id);
    if (!debt) return next(createError(404, "Debt not found"));

    res.status(200).json(debt);
  } catch (err) {
    next(err);
  }
};

export const deleteDebtByUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(createError(404, "User not found"));

    if (req.query.channelId) {
      const channel = await Channel.findById(req.query.channelId);
      if (!channel) return next(createError(404, "Channel not found"));
    }

    const debts = req.query.channelId
      ? await Debt.find({
          userId: req.params.userId,
          channelId: req.query.channelId,
        })
      : await Debt.find({ userId: req.params.userId });
    await Promise.all(debts.map(async (debt) => await debt.deleteOne()));
    res.status(200).json("Debts have been deleted");
  } catch (err) {
    next(err);
  }
};

export const deleteDebtById = async (req, res, next) => {
  try {
    const debt = await Debt.findById(req.params.id);
    if (!debt) return next(createError(404, "Debt not found"));

    await debt.deleteOne();
    res.status(200).json("The debt has been deleted");
  } catch (err) {
    next(err);
  }
};
