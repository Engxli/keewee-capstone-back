const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const MoodSchema = new Schema({
  name: { type: String, required: true },

  //relation
  places: [{ type: Schema.Types.ObjectId, ref: "Place" }],
});

module.exports = model("Mood", MoodSchema);
