const Place = require("../../models/Place");
const Amenity = require("../../models/Amenity");

exports.createAmenity = async (req, res, next) => {
  try {
    const existingAmenity = await Amenity.findOne({ name: req.body.name });
    if (existingAmenity) {
      return res.status(400).json({ messge: "Amenity already exists" });
    }
    const amenity = await Amenity.create(req.body);
    return res.status(201).json(amenity);
  } catch (error) {
    next(error);
  }
};
