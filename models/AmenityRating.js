const { model, Schema } = require("mongoose");

const AmenityRatingSchema = new Schema({
  amenity: { type: Schema.Types.ObjectId, ref: "Amenity" },
  place: { type: Schema.Types.ObjectId, ref: "Place" },
});

module.exports = model("AmenityRating", AmenityRatingSchema);
