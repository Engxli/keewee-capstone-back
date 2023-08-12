const Mood = require("../../models/Mood");

const History = require("../../models/History");

const Place = require("../../models/Place");
const Post = require("../../models/Post");
const PublicChat = require("../../models/PublicChat");

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

exports.getPlacePosts = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const place = await Place.findById(placeId)
      .populate("posts", "image createdAt")
      .populate({
        path: "posts",
        populate: {
          path: "user",
          select: "image username",
        },
      });
    res.status(200).json(place.posts);
  } catch (error) {
    next(error);
  }
};

exports.createPlace = async (req, res, next) => {
  try {
    const { lon, lat } = req.body;
    if (req.file) {
      req.body.image = `${req.file.path}`;
    }

    const existingPlace = await Place.findOne({ name: req.body.name });
    if (existingPlace) {
      return res.status(400).json({ message: "Place already exists" });
    }

    const place = await Place.create({
      ...req.body,
      location: {
        type: "Point",
        coordinates: [lon, lat],
      },
    });

    const createdChat = await PublicChat.create({
      place: place._id,
    });
    await place.updateOne({ $set: { publicChat: createdChat._id } });

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
    await req.place.populate("amenities");
    res.status(200).json(req.place.amenities);
  } catch (error) {
    next(error);
  }
};

exports.addAmenityToPlace = async (req, res, next) => {
  try {
    if (req.place.amenities.includes(amenityId)) {
      return res
        .status(400)
        .json({ message: "Amenity already associated with the place" });
    }
    req.place.amenities.push(amenityId);

    await req.place.save();

    return res.status(200).json({
      message: "Amenity added to place successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getNearbyPlaces = async (req, res, next) => {
  try {
    const nearbyPlaces = await Place.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: req.user.location.coordinates, // Longitude first, Latitude second
          },
          $maxDistance: 50,
          $minDistance: 0,
        },
      },
    });

    res.status(200).json(nearbyPlaces);
  } catch (error) {
    next(error);
  }
};
