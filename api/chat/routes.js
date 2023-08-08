const express = require("express");
const passport = require("passport");
const {
  getMyChats,
  getUserChat,
  getChat,
  sendChat,
  getPublicChats,
  sendPublicChat,
  getPlaceChat,
} = require("./controllers");
const User = require("../../models/User");
const router = express.Router();

router.param("userId", async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) next({ message: "User not found", status: 404 });
    req.foundUser = user;
    next();
  } catch (error) {
    next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), getMyChats);
router.get(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  getUserChat
);
router.get(
  "/msgs/:chatId",
  passport.authenticate("jwt", { session: false }),
  getChat
);

router.post(
  "/msgs/send/:chatId",
  passport.authenticate("jwt", { session: false }),
  sendChat
);
///////////////////
router.get(
  "/publicChats",
  passport.authenticate("jwt", { session: false }),
  getPublicChats
);
router.get(
  "/publicChat/:placeId",
  passport.authenticate("jwt", { session: false }),
  getPlaceChat
);
router.post(
  "/publicChat/:placeId",
  passport.authenticate("jwt", { session: false }),
  sendPublicChat
);

module.exports = router;
