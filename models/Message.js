const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const MessageSchema = new Schema(
  {
    publicChat: { type: Schema.Types.ObjectId, ref: "PublicChat" },
    privateChat: { type: Schema.Types.ObjectId, ref: "PrivateChat" },
    from: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Message", MessageSchema);
