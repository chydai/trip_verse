import mongoose from "mongoose";
import { Schema } from "mongoose";
import DatePlan from "./DatePlan.js";

const ChannelSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    groupId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Group",
    },
    name: {
      type: String,
      required: true,
    },
    members: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

// middleware
ChannelSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    // DatePlan
    const datePlansInThisChannel = await DatePlan.find({ channelId: this._id });
    await Promise.all(
      datePlansInThisChannel.map(async (datePlan) => await datePlan.deleteOne())
    );

    next();
  }
);

export default mongoose.model("Channel", ChannelSchema);
