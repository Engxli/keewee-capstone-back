const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const RatingSchema = new Schema({
  number: { type: Number, required: true },

  // relation
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Rating", RatingSchema);
