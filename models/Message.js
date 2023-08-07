const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const MessageSchema = new Schema(
  {
    text: { type: String, required: true },

    //relation
    publicChat: { type: Schema.Types.ObjectId, ref: "PublicChat" },
    privateChat: { type: Schema.Types.ObjectId, ref: "PrivateChat" },
    from: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Message", MessageSchema);
