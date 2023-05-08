import { createError } from "../utils/error.js";
import DatePlan from "../models/DatePlan.js";
import Channel from "../models/Channel.js";

export const createDatePlan = async (req, res, next) => {
  const newDatePlan = new DatePlan({
    channelId: req.params.channelId,
    ...req.body,
  });
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) return next(createError(404, "Channel not found"));
    if (!channel.members.includes(req.user.id))
      return next(createError(403, "You need to join this channel first"));

    const savedDatePlan = await newDatePlan.save();
    res.status(200).json(savedDatePlan);
  } catch (err) {
    next(err);
  }
};

export const getAllDatePlans = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) return next(createError(404, "Channel not found"));
    if (!channel.members.includes(req.user.id))
      return next(createError(403, "You can only view the date plans in your channel"));

    const datePlans = await DatePlan.find({ channelId: req.params.channelId });
    res.status(200).json(datePlans);
  } catch (err) {
    next(err);
  }
};

export const getDatePlanById = async (req, res, next) => {
  try {
    const datePlan = await DatePlan.findById(req.params.id);
    if (!datePlan) return next(createError(404, "Date Plan not found"));

    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(
        createError(403, "You can only view the date plan in your channel")
      );
    res.status(200).json(datePlan);
  } catch (err) {
    next(err);
  }
};

export const updateDatePlan = async (req, res, next) => {
  try {
    const datePlan = await DatePlan.findById(req.params.id);
    if (!datePlan) return next(createError(404, "Date Plan not found"));

    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(
        createError(403, "You can only update the date plan in your channel")
      );

    const updatedDatePlan = await DatePlan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedDatePlan);
  } catch (err) {
    next(err);
  }
};

export const deleteDatePlan = async (req, res, next) => {
  try {
    const datePlan = await DatePlan.findById(req.params.id);
    if (!datePlan) return next(createError(404, "Date Plan not found"));

    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(
        createError(403, "You can only delete the date plan in your channel")
      );

    await datePlan.deleteOne();
    res.status(200).json("The date plan has been deleted");
  } catch (err) {
    next(err);
  }
};
