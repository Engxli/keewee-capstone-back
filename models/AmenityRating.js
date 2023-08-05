const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const AmenityRatingSchema = new Schema({
  amenity: { type: Schema.Types.ObjectId, ref: "Rating" },
  place: { type: Schema.Types.ObjectId, ref: "Place" },
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
});

module.exports = model("AmenityRating", AmenityRatingSchema);
