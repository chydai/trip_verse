import mongoose from "mongoose";
import { Schema } from "mongoose";
import Channel from "./Channel.js";

const GroupSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    members: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    imgUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// middleware
GroupSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    // Channel
    const channelsInThisGroup = await Channel.find({ groupId: this._id });
    await Promise.all(channelsInThisGroup.map(async (channel) => await channel.deleteOne()));

    next();
  }
);

export default mongoose.model("Group", GroupSchema);
