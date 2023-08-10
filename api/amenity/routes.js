const express = require("express");

const Place = require("../../models/Place");

const { createAmenity } = require("./controllers");

const passport = require("passport");
const router = express.Router();

router.param("placeId", async (req, res, next, placeId) => {
  try {
    const place = await Place.findById(placeId);

    if (!place)
      return res.status(404).json({
        message: " no plave matches that ID!",
      });
    req.place = place;
    next();
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createAmenity
);

module.exports = router;
