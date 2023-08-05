const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const PublicChatSchema = new Schema({
  place: { type: Schema.Types.ObjectId, ref: "Place" },
  msgs: { type: Schema.Types.ObjectId, ref: "Message" },
});

module.exports = model("PublicChat", PublicChatSchema);
