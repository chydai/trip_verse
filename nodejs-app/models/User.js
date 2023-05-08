import mongoose from "mongoose";
import { Schema } from "mongoose";
import Group from "./Group.js";
import Channel from "./Channel.js";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  followers: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [String],
    default: [],
  },
  avatarUrl: {
    type: String,
    default: "",
  },
  backgroundUrl: {
    type: String,
    default: "",
  },
});

// middleware
UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    // User
    const User = this.model("User");
    await User.updateMany(
      { followers: this._id },
      { $pull: { followers: this._id } }
    );
    await User.updateMany(
      { following: this._id },
      { $pull: { following: this._id } }
    );

    // Group
    const ownedGroups = await Group.find({ userId: this._id });
    await Promise.all(
      ownedGroups.map(async (group) => await group.deleteOne())
    );
    await Group.updateMany(
      { members: this._id },
      { $pull: { members: this._id } }
    );
    await Group.updateMany({ likes: this._id }, { $pull: { likes: this._id } });

    // Channel
    const ownedChannels = await Channel.find({ userId: this._id });
    await Promise.all(
      ownedChannels.map(async (channel) => await channel.deleteOne())
    );
    await Channel.updateMany(
      { members: this._id },
      { $pull: { members: this._id } }
    );

    next();
  }
);

export default mongoose.model("User", UserSchema);
