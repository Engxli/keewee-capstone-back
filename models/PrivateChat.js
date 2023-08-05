const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const PrivateChatSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  msgs: { type: Schema.Types.ObjectId, ref: "Message" },
});

module.exports = model("PrivateChat", PrivateChatSchema);
