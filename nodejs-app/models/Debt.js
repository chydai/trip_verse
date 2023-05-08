import mongoose from "mongoose";
import { Schema } from "mongoose";

const DebtSchema = new mongoose.Schema({
  channelId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Channel",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  settled: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Debt", DebtSchema);
