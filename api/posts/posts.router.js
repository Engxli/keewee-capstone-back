const Post = require("../../models/Post");
const express = require("express");
const {
  createPost,
  getAllPosts,
  upadatePost,
  deletePost,
  getPostById,
} = require("./posts.controllers");
const upload = require("../../middlewares/multer");
const passport = require("passport");
const router = express.Router();

router.param("postId", async (req, res, next, postId) => {
  try {
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        message: " no post matches that ID!",
      });
    req.post = post;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/", getAllPosts);

router.post(
  "/",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  createPost
);

router.get("/:postId", getPostById);
router.put(
  "/:postId",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  upadatePost
);
router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  deletePost
);
module.exports = router;
