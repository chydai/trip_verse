import mongoose from "mongoose";
import { Schema } from "mongoose";
import Debt from "./Debt.js";
import Channel from "./Channel.js";
import DatePlan from "./DatePlan.js";

const BillSchema = new mongoose.Schema(
  {
    datePlanId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "DatePlan",
    },
    description: {
      type: String,
      required: true,
    },
    payer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    debt: {
      type: [
        {
          user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
          balance: { type: Number, required: true },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

// middleware
BillSchema.pre("save", { document: true, query: false }, async function (next) {
  const datePlan = await DatePlan.findById(this.datePlanId);
  const channel = await Channel.findById(datePlan.channelId);

  await Promise.all(
    this.debt.map(async (entry) => {
      const debtOfUser = await Debt.findOne({
        userId: this.payer,
        targetId: entry.user,
        channelId: channel._id,
      });
      if (debtOfUser) {
        await debtOfUser.updateOne({ $inc: { balance: -entry.balance } });
      } else {
        const newDebt = new Debt({
          channelId: channel._id,
          userId: this.payer,
          targetId: entry.user,
          balance: -entry.balance,
        });
        await newDebt.save();
      }

      const debtOfTarget = await Debt.findOne({
        userId: entry.user,
        targetId: this.payer,
        channelId: channel._id,
      });
      if (debtOfTarget) {
        await debtOfTarget.updateOne({ $inc: { balance: entry.balance } });
      } else {
        const newDebt = new Debt({
          channelId: channel._id,
          userId: entry.user,
          targetId: this.payer,
          balance: entry.balance,
        });
        await newDebt.save();
      }
    })
  );

  next();
});

BillSchema.pre(
  "updateOne",
  { document: true, query: false },
  async function (next) {
    const datePlan = await DatePlan.findById(this.datePlanId);
    const channel = await Channel.findById(datePlan.channelId);

    await Promise.all(
      this.debt.map(async (entry) => {
        const debtOfUser = await Debt.findOneAndUpdate(
          {
            userId: this.payer,
            targetId: entry.user,
            channelId: channel._id,
          },
          { $inc: { balance: entry.balance } },
          { new: true }
        );
        if (Math.abs(debtOfUser.balance) < 1e-5) await debtOfUser.deleteOne();

        const debtOfTarget = await Debt.findOneAndUpdate(
          {
            userId: entry.user,
            targetId: this.payer,
            channelId: channel._id,
          },
          { $inc: { balance: -entry.balance } },
          { new: true }
        );
        if (Math.abs(debtOfTarget.balance) < 1e-5)
          await debtOfTarget.deleteOne();
      })
    );

    next();
  }
);

BillSchema.post(
  "updateOne",
  { document: true, query: false },
  async function (doc) {
    const Bill = this.model("Bill");
    const bill = await Bill.findById(doc._id);

    const datePlan = await DatePlan.findById(bill.datePlanId);
    const channel = await Channel.findById(datePlan.channelId);

    await Promise.all(
      bill.debt.map(async (entry) => {
        const debtOfUser = await Debt.findOne({
          userId: bill.payer,
          targetId: entry.user,
          channelId: channel._id,
        });
        if (debtOfUser) {
          await debtOfUser.updateOne({ $inc: { balance: -entry.balance } });
        } else {
          const newDebt = new Debt({
            channelId: channel._id,
            userId: bill.payer,
            targetId: entry.user,
            balance: -entry.balance,
          });
          await newDebt.save();
        }

        const debtOfTarget = await Debt.findOne({
          userId: entry.user,
          targetId: bill.payer,
          channelId: channel._id,
        });
        if (debtOfTarget) {
          await debtOfTarget.updateOne({ $inc: { balance: entry.balance } });
        } else {
          const newDebt = new Debt({
            channelId: channel._id,
            userId: entry.user,
            targetId: bill.payer,
            balance: entry.balance,
          });
          await newDebt.save();
        }
      })
    );
  }
);

BillSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const datePlan = await DatePlan.findById(this.datePlanId);
    const channel = await Channel.findById(datePlan.channelId);

    await Promise.all(
      this.debt.map(async (entry) => {
        const debtOfUser = await Debt.findOneAndUpdate(
          {
            userId: this.payer,
            targetId: entry.user,
            channelId: channel._id,
          },
          { $inc: { balance: entry.balance } },
          { new: true }
        );
        if (Math.abs(debtOfUser.balance) < 1e-5) await debtOfUser.deleteOne();

        const debtOfTarget = await Debt.findOneAndUpdate(
          {
            userId: entry.user,
            targetId: this.payer,
            channelId: channel._id,
          },
          { $inc: { balance: -entry.balance } },
          { new: true }
        );
        if (Math.abs(debtOfTarget.balance) < 1e-5)
          await debtOfTarget.deleteOne();
      })
    );

    next();
  }
);

export default mongoose.model("Bill", BillSchema);
