const express = require("express");

const Place = require("../../models/Place");
const { getAllPlaces, createPlace, getPlaceById } = require("./controllers");
const upload = require("../../middlewares/multer");
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

router.get("/", getAllPlaces);

router.post("/", upload.single("image"), createPlace);

router.get("/:placeId", getPlaceById);

module.exports = router;
