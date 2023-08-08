const Mood = require("../../models/Mood");
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
      name: req.body.name,
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
exports.addMoodToPlace = async (req, res, next) => {
  try {
    const { moodId, placeId } = req.params;

    if (!placeId || !moodId) {
      return res.status(400).json({ error: "Required IDs are missing" });
    }
    // Checking if the mood exists
    const mood = await Mood.findById(moodId);
    if (!mood) {
      return res.status(404).json({ error: "Mood not found" });
    }

    // Add the mood to the place's mood array
    await Place.findByIdAndUpdate(placeId, {
      $push: { moods: moodId },
    });

    // Add the place to the mood's places array
    await Mood.findByIdAndUpdate(moodId, {
      $push: { places: placeId },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
