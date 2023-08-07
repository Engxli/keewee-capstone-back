const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const AmenityRatingSchema = new Schema({
  // relation
  amenity: { type: Schema.Types.ObjectId, ref: "Amenity" },
  place: { type: Schema.Types.ObjectId, ref: "Place" },
});

module.exports = model("AmenityRating", AmenityRatingSchema);
