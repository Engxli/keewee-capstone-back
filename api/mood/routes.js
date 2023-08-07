const express = require("express");

const Mood = require("../../models/Mood");
const { getAllMood, createMood } = require("./controllers");
const passport = require("passport");
const router = express.Router();

router.param("moodId", async (req, res, next, moodId) => {
  try {
    const mood = await Mood.findById(moodId);

    if (!mood)
      return res.status(404).json({
        message: " no plave matches that ID!",
      });
    req.mood = mood;
    next();
  } catch (error) {
    next(error);
  }
});

router.get("/", getAllMood);

router.post("/", createMood);

module.exports = router;
