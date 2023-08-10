const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const AmenitySchema = new Schema({
  icon: { type: String, required: true },
  name: { type: String, required: true },
});

module.exports = model("Amenity", AmenitySchema);
