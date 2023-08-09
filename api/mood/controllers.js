const Mood = require("../../models/Mood");
const Place = require("../../models/Place");

exports.getAllMood = async (req, res, next) => {
  try {
    const mood = await Mood.find();
    res.status(200).json(mood);
  } catch (error) {
    next(error);
  }
};

exports.createMood = async (req, res, next) => {
  try {
    const existingMood = await Mood.findOne({
      name: req.body.name,
    });

    if (existingMood) {
      return res.status(400).json({ messge: "mood already exists" });
    }
    const mood = await Mood.create(req.body);
    return res.status(201).json(mood);
  } catch (error) {
    next(error);
  }
};
