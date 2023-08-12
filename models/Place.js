const { model, Schema } = require("mongoose");

const PlaceSchema = new Schema({
  name: { type: String, required: true },

  image: { type: String, required: false },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
    },
  },
  //relation

  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],

  amenitiesRatings: [{ type: Schema.Types.ObjectId, ref: "AmenityRating" }],

  amenities: [{ type: Schema.Types.ObjectId, ref: "Amenity" }],

  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],

  moods: [{ type: Schema.Types.ObjectId, ref: "Mood" }],

  publicChat: { type: Schema.Types.ObjectId, ref: "PublicChat" },
});
PlaceSchema.index({ location: "2dsphere" });

module.exports = model("Place", PlaceSchema);
