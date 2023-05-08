import mongoose from "mongoose";
import { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        placeId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Place",
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        content: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

// middleware
CommentSchema.pre(
    "deleteOne",
    { document: true, query: false },
    async function (next) {
        next();
    }
);

export default mongoose.model("Comment", CommentSchema);
