const { model, Schema } = require("mongoose");

const MoodSchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String },
  //relation
  places: [{ type: Schema.Types.ObjectId, ref: "Place" }],
});

module.exports = model("Mood", MoodSchema);
