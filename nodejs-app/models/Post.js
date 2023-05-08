import mongoose from "mongoose";
import { Schema } from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    imgUrls: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// middleware
PostSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    next();
  }
);

export default mongoose.model("Post", PostSchema);
