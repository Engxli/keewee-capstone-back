const { model, Schema } = require("mongoose");

const PlaceSchema = new Schema({
  name: { type: String, required: true },

  image: { type: String, required: true },

  description: { type: String },
  lon: { type: String },
  lat: { type: String },

  // location: {
  //   type: "Point",
  //   coordinates: [longitude, latitude],
  // },

  //relation

  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],

  amenitiesRatings: [{ type: Schema.Types.ObjectId, ref: "AmenityRating" }],

  amenities: [{ type: Schema.Types.ObjectId, ref: "Amenity" }],

  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],

  moods: [{ type: Schema.Types.ObjectId, ref: "Mood" }],

  publicChat: { type: Schema.Types.ObjectId, ref: "PublicChat" },
});

module.exports = model("Place", PlaceSchema);
