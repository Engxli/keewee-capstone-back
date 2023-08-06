const express = require("express");

const Place = require("../../models/Place");

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

module.exports = router;
