const Place = require("../../models/Place");

exports.getAllPlaces = async (req, res, next) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    next(error);
  }
};

exports.getPlaceById = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const place = await Place.findById(placeId);
    // .populate("createdBy", "username");
    res.status(200).json(place);
  } catch (error) {
    next(error);
  }
};

exports.createPlace = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.file.path}`;
    }
    const existingPlace = await Place.findOne({
      title: req.body.title,
    });

    if (existingPlace) {
      return res.status(400).json({ messge: "place alredy exists" });
    }

    const place = await Place.create(req.body);

    return res.status(201).json(place);
  } catch (error) {
    next(error);
  }
};
