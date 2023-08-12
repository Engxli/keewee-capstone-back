const jwt = require("jsonwebtoken");
const config = require("../../config/keys");

module.exports = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    image: user.image,
    location: user.location,
  };
  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_TOKEN_EXP,
  });
  return token;
};
