const express = require("express");
const upload = require("../../middlewares/multer");
const passport = require("passport");
const {
  createMeetUpRequest,
  getMyMeetUpRequest,
  acceptMeetUpRequest,
  declineMeetUpRequest,
} = require("./controllers");
const MeetUpRequest = require("../../models/MeetUpRequest");
const User = require("../../models/User");
const router = express.Router();

router.param("meetUpId", async (req, res, next, meetUpId) => {
  try {
    const meetUp = await MeetUpRequest.findById(meetUpId);
    if (!meetUp)
      return res.status(404).json({
        message: " no meetUp matches that ID!",
      });
    req.meetUpRequest = meetUp;
    next();
  } catch (error) {
    next(error);
  }
});
router.param("userId", async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        message: " no meetUp matches that ID!",
      });
    req.foundUser = user;
    next();
  } catch (error) {
    next(error);
  }
});
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getMyMeetUpRequest
);
router.post(
  "/:userId",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  createMeetUpRequest
);
router.post(
  "/accept/:meetUpId",
  passport.authenticate("jwt", { session: false }),
  acceptMeetUpRequest
);
router.delete(
  "/decline/:meetUpId",
  passport.authenticate("jwt", { session: false }),
  declineMeetUpRequest
);

module.exports = router;
