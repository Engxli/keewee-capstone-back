const History = require("../../models/History");
const Place = require("../../models/Place");
const Post = require("../../models/Post");

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
    const existingPlace = await Place.findOne({ name: req.body.name });
    if (existingPlace) {
      return res.status(400).json({ messge: "place already exists" });
    }
    const place = await Place.create(req.body);
    return res.status(201).json(place);
  } catch (error) {
    next(error);
  }
};

exports.checkIn = async (req, res, next) => {
  try {
    const place = await Place.findOne({ _id: req.body.place });
    if (!place) {
      return res.status(404).json({ message: "place is not found" });
    }
    if (req.file) {
      req.body.image = `${req.file.path.replace("\\", "/")}`;
      const post = await Post.create({
        image: req.body.image,
        user: req.user._id,
      });
      await req.user.updateOne({ $push: { posts: post._id } });
      await place.updateOne({ $push: { posts: post._id } });
    }
    if (req.body.rate) {
    }
    if (req.body.mood) {
    }
    if (req.body.amenityRating) {
    }
    const history = await History.create({
      place: place._id,
      user: req.user._id,
    });
    await req.user.updateOne({ $push: { history: history._id } });
    return res.status(200).json();
  } catch (error) {
    next(error);
  }
};

exports.getPlaceAmenities = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const place = await Place.findById(placeId).populate("amenities");
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(place.amenities);
  } catch (error) {
    next(error);
  }
};
