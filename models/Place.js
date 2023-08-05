const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const PlaceSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  location: { lon: { String }, lat: { String } },
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  amenitiesRatings: [{ type: Schema.Types.ObjectId, ref: "AmenityRating" }],
  posts: [{ type: String }],
  publicChat: { type: Schema.Types.ObjectId, ref: "PublicChat" },
});

module.exports = model("Place", PlaceSchema);
