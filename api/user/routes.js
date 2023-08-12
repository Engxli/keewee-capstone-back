const express = require("express");
const {
  createUser,
  fetchUser,
  signin,
  getUsers,
  getProfile,
  getMyProfile,
  checkUsername,
  createFriendRequest,
  declineFriendRequest,
  acceptFriendRequest,
  getMyFriendRequest,
  updateUserLocation,
} = require("./controllers");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/multer");
const {
  usernameValidator,
  passwordValidator,
  inputValidator,
  FieldValidation,
} = require("../../middlewares/userValidation");

router.param("userId", async (req, res, next, userId) => {
  try {
    const foundUser = await fetchUser(userId);
    if (!foundUser) return next({ status: 404, message: "User not found" });
    req.foundUser = foundUser;
    next();
  } catch (error) {
    return next(error);
  }
});
router.put("/username", checkUsername);
router.get("/", passport.authenticate("jwt", { session: false }), getUsers);
router.get(
  "/profile/:userId",
  passport.authenticate("jwt", { session: false }),
  getProfile
);
router.get(
  "/my-profile",
  passport.authenticate("jwt", { session: false }),
  getMyProfile
);
router.post(
  "/register",
  upload.single("image"),
  // inputValidator([...usernameValidator, ...passwordValidator], true),
  // FieldValidation,
  createUser
);
router.post(
  "/sign-in",
  passport.authenticate("local", { session: false }),
  signin
);

/////////////
router.put(
  "/updateLocation",
  passport.authenticate("jwt", { session: false }),
  updateUserLocation
);
////////////

router.post(
  "/friend-request/:userId",
  passport.authenticate("jwt", { session: false }),
  createFriendRequest
);
router.put(
  "/friend-request/accept/:friendRequestId",
  passport.authenticate("jwt", { session: false }),
  acceptFriendRequest
);
router.delete(
  "/friend-request/decline/:friendRequestId",
  passport.authenticate("jwt", { session: false }),
  declineFriendRequest
);

router.get(
  "/my-friend-request",
  passport.authenticate("jwt", { session: false }),
  getMyFriendRequest
);
module.exports = router;
