const express = require("express");

const Place = require("../../models/Place");
const {
  getAllPlaces,
  createPlace,
  getPlaceById,
  checkIn,
  getPlaceAmenities,
  addAmenityToPlace,
} = require("./controllers");
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

router.get("/", passport.authenticate("jwt", { session: false }), getAllPlaces);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  createPlace
);

router.post(
  "/check-in",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  checkIn
);

router.get(
  "/:placeId",
  passport.authenticate("jwt", { session: false }),
  getPlaceById
);

router.get("/:placeId/amenities", getPlaceAmenities);

router.post(
  "/:placeId/add-amenity",
  passport.authenticate("jwt", { session: false }),
  addAmenityToPlace
);

module.exports = router;
