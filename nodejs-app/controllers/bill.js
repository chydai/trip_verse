import { createError } from "../utils/error.js";
import Bill from "../models/Bill.js";
import DatePlan from "../models/DatePlan.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";

export const createBill = async (req, res, next) => {
  const newBill = new Bill({
    datePlanId: req.params.datePlanId,
    ...req.body,
  });

  try {
    const datePlan = await DatePlan.findById(req.params.datePlanId);
    if (!datePlan) return next(createError(404, "Date Plan not found"));

    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(createError(403, "You need to join this channel first"));

    const payer = await User.findById(req.body.payer);
    if (!payer) return next(createError(404, "Payer not found"));
    if (!channel.members.includes(req.body.payer))
      return next(
        createError(403, `Payer <${payer.name}> not in this channel`)
      );

    let [namesNotInChannel, notFound, sameAsPayer] = [[], false, false];
    await Promise.all(
      req.body.debt.map(async ({ user }) => {
        const userDoc = await User.findById(user);
        if (!userDoc) notFound = true;
        else if (userDoc._id.equals(payer._id)) sameAsPayer = true;
        else if (!channel.members.includes(user))
          namesNotInChannel.push(`<${userDoc.name}>`);
      })
    );
    if (notFound) return next(createError(404, "User not found"));
    else if (sameAsPayer)
      return next(
        createError(403, "Target user should not be the same as the payer")
      );
    else if (namesNotInChannel.length > 0)
      return next(
        createError(
          403,
          `User ${namesNotInChannel.join(" ")} not in this channel`
        )
      );

    if (newBill.debt.length === 0)
      return next(createError(403, "Debt length must be larger than 0"));

    const savedBill = await newBill.save();
    res.status(200).json(savedBill);
  } catch (err) {
    next(err);
  }
};

export const getAllBills = async (req, res, next) => {
  try {
    if (req.query.datePlanId && req.query.channelId)
      next(createError(403, "You can only specify 1 query parameter"));
    if (req.query.datePlanId) {
      const datePlan = await DatePlan.findById(req.query.datePlanId);
      if (!datePlan) return next(createError(404, "Date Plan not found"));

      const channel = await Channel.findById(datePlan.channelId);
      if (!channel.members.includes(req.user.id))
        return next(
          createError(403, "You can only view the bills in your channel")
        );

      const bills = await Bill.find({ datePlanId: req.query.datePlanId });
      res.status(200).json(bills);
    } else if (req.query.channelId) {
      const channel = await Channel.findById(req.query.channelId);
      if (!channel) return next(createError(404, "Channel not found"));
      if (!channel.members.includes(req.user.id))
        return next(
          createError(403, "You can only view the bills in your channel")
        );

      const datePlans = await DatePlan.find({ channelId: req.query.channelId });
      const datePlanIds = datePlans.map((datePlan) => datePlan._id);
      const bills = await Bill.find({ datePlanId: { $in: datePlanIds } });
      res.status(200).json(bills);
    } else next(createError(403, "Invalid query parameter"));
  } catch (err) {
    next(err);
  }
};

export const getBillById = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return next(createError(404, "Bill not found"));

    const datePlan = await DatePlan.findById(bill.datePlanId);
    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(
        createError(403, "You can only view the bill in your channel")
      );

    res.status(200).json(bill);
  } catch (err) {
    next(err);
  }
};

export const updateBill = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return next(createError(404, "Bill not found"));

    const datePlan = await DatePlan.findById(bill.datePlanId);
    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(
        createError(403, "You can only update the bill in your channel")
      );

    const payer = await User.findById(req.body.payer);
    if (!payer) return next(createError(404, "Payer not found"));
    if (!channel.members.includes(req.body.payer))
      return next(
        createError(403, `Payer <${payer.name}> not in this channel`)
      );

    let [namesNotInChannel, notFound, sameAsPayer] = [[], false, false];
    await Promise.all(
      req.body.debt.map(async ({ user }) => {
        const userDoc = await User.findById(user);
        if (!userDoc) notFound = true;
        else if (userDoc._id.equals(payer._id)) sameAsPayer = true;
        else if (!channel.members.includes(user))
          namesNotInChannel.push(`<${userDoc.name}>`);
      })
    );
    if (notFound) return next(createError(404, "User not found"));
    else if (sameAsPayer)
      return next(
        createError(403, "Target user should not be the same as the payer")
      );
    else if (namesNotInChannel.length > 0)
      return next(
        createError(
          403,
          `User ${namesNotInChannel.join(" ")} not in this channel`
        )
      );

    if (req.body.debt.length === 0)
      return next(createError(403, "Debt length must be larger than 0"));

    await bill.updateOne({ $set: req.body });
    const updatedBill = await Bill.findById(req.params.id);
    res.status(200).json(updatedBill);
  } catch (err) {
    next(err);
  }
};

export const deleteBill = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return next(createError(404, "Bill not found"));

    const datePlan = await DatePlan.findById(bill.datePlanId);
    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(
        createError(403, "You can only delete the bill in your channel")
      );

    await bill.deleteOne();
    res.status(200).json("The bill has been deleted");
  } catch (err) {
    next(err);
  }
};
