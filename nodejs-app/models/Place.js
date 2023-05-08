import mongoose from "mongoose";
import { Schema } from "mongoose";
import Comment from "./Comment.js";

const PlaceSchema = new mongoose.Schema({
  datePlanId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "DatePlan",
  },
  name: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  startTime: {
    type: String,
    default: "",
  },
  endTime: {
    type: String,
    default: "",
  },
  imgUrl: {
    type: String,
    default: "",
  },
});

// middleware
PlaceSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    // delete cascade

    // Comment
    const commentInThisGroup = await Comment.find({ placeId: this._id });
    await Promise.all(commentInThisGroup.map(async (comment) => await comment.deleteOne()));

    next();
  }
);

export default mongoose.model("Place", PlaceSchema);
