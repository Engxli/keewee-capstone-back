const Mood = require("../../models/Mood");

const History = require("../../models/History");

const Place = require("../../models/Place");
const Post = require("../../models/Post");
const PublicChat = require("../../models/PublicChat");
const Amenity = require("../../models/Amenity");

exports.getAllPlaces = async (req, res, next) => {
  try {
    const votesLowestLimit = 5;
    const places = await Place.find().populate("amenities moods");
    // Counting the occurrences of each amenity
    const amenityCounts = {};
    places.forEach((place) => {
      place.amenities.forEach((amenity) => {
        amenityCounts[amenity._id] = (amenityCounts[amenity._id] || 0) + 1;
      });
    });

    // Counting the occurrences of each mood
    const moodCounts = {};
    places.forEach((place) => {
      place.moods.forEach((mood) => {
        moodCounts[mood._id] = (moodCounts[mood._id] || 0) + 1;
      });
    });

    const frequentAmenities = Object.keys(amenityCounts).filter(
      (key) => amenityCounts[key] > votesLowestLimit
    );
    const frequentMoods = Object.keys(moodCounts).filter(
      (key) => moodCounts[key] > votesLowestLimit
    );

    const addedAmenities = new Set();
    const addedMoods = new Set();

    places.forEach((place) => {
      place.amenities = place.amenities.filter((amenity) => {
        if (
          frequentAmenities.includes(amenity._id.toString()) &&
          !addedAmenities.has(amenity._id.toString())
        ) {
          addedAmenities.add(amenity._id.toString());
          return true;
        }
        return false;
      });

      place.moods = place.moods.filter((mood) => {
        if (
          frequentMoods.includes(mood._id.toString()) &&
          !addedMoods.has(mood._id.toString())
        ) {
          addedMoods.add(mood._id.toString());
          return true;
        }
        return false;
      });
    });

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
    if (req.file) {
      req.body.image = `${req.file.path}`;
    }

    // Re-structure location object
    // if (req.body["location[lat]"] && req.body["location[lon]"]) {
    //   req.body.location = {
    //     lat: req.body["location[lat]"],
    //     lon: req.body["location[lon]"],
    //   };
    // }

    const existingPlace = await Place.findOne({ name: req.body.name });
    if (existingPlace) {
      return res.status(400).json({ message: "place already exists" });
    }

    const place = await Place.create(req.body);

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
    const { moodId } = req.params;

    // Checking if the mood exists
    const mood = await Mood.findById(moodId);
    if (!mood) {
      return res.status(404).json({ error: "Mood not found" });
    }
    console.log(req.place);
    // Add the mood to the place's mood array
    await req.place.updateOne({
      $push: { moods: mood._id },
    });

    // Add the place to the mood's places array
    await mood.updateOne({
      $push: { places: req.place._id },
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
    if (req.body.moods) {
      const moodsArray = req.body.moods.split(",");
      moodsArray.forEach((mood) => place.moods.push(mood));
      place.save();
    }
    if (req.body.amenities) {
      const amenitiesArray = req.body.amenities.split(",");
      amenitiesArray.forEach((amenity) => place.amenities.push(amenity));
      place.save();
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
    const { amenityId } = req.params;
    const amenity = await Amenity.findById(amenityId);
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }
    if (req.place.amenities.includes(amenity._id)) {
      return res
        .status(400)
        .json({ message: "Amenity already associated with the place" });
    }
    req.place.amenities.push(amenity._id);

    await req.place.save();

    return res.status(200).json({
      message: "Amenity added to place successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getNearbyPlaces = async (req, res, next) => {
  console.log(req.query);
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required." });
  }
  try {
    const nearbyPlaces = await Place.find({
      location: {
        $near: [parseFloat(lon), parseFloat(lat)],
        $maxDistance: 0.001, //  in degrees
      },
    });
    res.status(200).json(nearbyPlaces);
  } catch (error) {
    next(error);
  }
};
