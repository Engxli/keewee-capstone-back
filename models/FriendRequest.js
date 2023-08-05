const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const FriendRequestSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User" },
    to: { type: Schema.Types.ObjectId, ref: "User" },
    pending: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model("FriendRequest", FriendRequestSchema);
