const User = require("../../models/User");
const passHash = require("../../utils/auth/passhash");
const generateToken = require("../../utils/auth/generateToken");
const FriendRequest = require("../../models/FriendRequest");
const { sendNotificationMsgs } = require("../../utils/notifications");

exports.fetchUser = async (userId, next) => {
  try {
    const user1 = await User.findById(userId);
    return user1;
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-__v -password ");
    return res.status(200).json(users);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await User.findById(req.foundUser._id)
      .select("-__v -password")
      .populate("posts history friendRequests", "image createdAt from")
      .populate({
        path: "history",
        select: "place createdAt",
        populate: {
          path: "place",
          select: "image name",
        },
      });
    return res.status(200).json(profile);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await User.findById(req.user._id)
      .select("-__v -password")
      .populate("posts history", "image createdAt")
      .populate({
        path: "history",
        select: "place createdAt",
        populate: {
          path: "place",
          select: "image name",
        },
      })
      .populate({
        path: "friends",
        select: "image username",
      })
      .populate({
        path: "friendRequests",
        select: "from to",
        populate: {
          path: "from to",
          select: "image username",
        },
      });
    return res.status(200).json(profile);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getMyFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate("friends");
    return res.status(200).json(user.friends);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.file.path.replace("\\", "/")}`;
    }
    if (!req.body.image)
      return next({ status: 400, message: "no image was uploaded!" });

    const { password } = req.body;
    req.body.password = await passHash(password);
    req.body.notificationTokens = [];
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const token = generateToken(req.user);

    // from front-end
    if (req.body.lon && req.body.lat) {
      await exports.updateUserLocation(
        req.user._id,
        req.body.lon,
        req.body.lat
      );
    }
    return res.status(200).json({ token });
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

///////////////
//////////////

exports.updateUserLocation = async (req, res, next) => {
  try {
    const { lon, lat } = req.body;
    console.log(lon, lat);
    await req.user.updateOne({
      location: {
        type: "Point",
        coordinates: [lon, lat],
      },
    });
    res.status(200).json({ coordinates: [lon, lat] });
  } catch (error) {
    next(error);
  }
};

/////////////////
/////////////////
function getRandomWord(length) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function vowelToNumber(username) {
  const map = { a: "2", e: "5", i: "1", o: "0", u: "4" };
  return username
    .split("")
    .map((c) => map[c] || c)
    .join("");
}
exports.checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (user) {
      let suggestions = [];
      let attempts = 0;
      while (suggestions.length < 5 && attempts < 50) {
        // Add an attempt counter
        attempts++; // Increment attempts counter
        let newUsername = "";
        const randomAdj = getRandomWord(5); // Get a random word of length 5
        const randomNumber = Math.floor(Math.random() * 100);

        switch (suggestions.length) {
          case 0:
            newUsername = username + randomNumber;
            break;
          case 1:
            newUsername = randomNumber + username;
            break;
          case 2:
            newUsername = vowelToNumber(username);
            break;
          case 3:
            newUsername = randomAdj + username;
            break;
          case 4:
            newUsername = username + randomAdj;
            break;
          default:
            break;
        }

        let userExists = await User.findOne({ username: newUsername });
        if (!userExists) {
          suggestions.push(newUsername);
        }
      }

      return res
        .status(200)
        .json({ message: "Username is taken", suggestions });
    }
    return res.status(200).json({ message: "Username is available" });
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.addNotificationTokenToUser = async (req, res, next) => {
  try {
    const foundToken = req.user.notificationTokens.find(
      (token) => token === req.body.token
    );

    if (foundToken) {
      return res.status(204).end();
    }
    await req.user.updateOne({
      $push: {
        notificationTokens: req.body.token,
      },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

exports.createFriendRequest = async (req, res, next) => {
  try {
    // const user = await User.findById(req.user._id).populate("friendRequests");

    if (req.user._id.equals(req.foundUser._id)) {
      return res
        .status(400)
        .json({ message: "You can't send a friend request to yourself!" });
    }

    if (req.user.friends.includes(req.foundUser._id)) {
      return res.status(400).json({ message: "You are already friends!" });
    }

    const friendRequestExists = await FriendRequest.findOne({
      from: req.user._id,
      to: req.foundUser._id,
    });

    if (friendRequestExists) {
      return res
        .status(400)
        .json({ message: "You already sent a friend request!" });
    }

    const friendRequestExists2 = await FriendRequest.findOne({
      from: req.foundUser._id,
      to: req.user._id,
    });

    if (friendRequestExists2) {
      // add frined
      await req.user.updateOne({ $push: { friends: req.foundUser._id } });
      await req.foundUser.updateOne({ $push: { friends: req.user._id } });

      await req.user.updateOne({
        $pull: { friendRequests: friendRequestExists2._id },
      });

      await req.foundUser.updateOne({
        $pull: { friendRequests: friendRequestExists2._id },
      });

      await friendRequestExists2.deleteOne();

      return res.status(200).json({ message: "Friend request accepted" });
    }

    const friendRequest = await FriendRequest.create({
      from: req.user._id,
      to: req.foundUser._id,
    });
    await req.user.updateOne({
      $push: { friendRequests: friendRequest._id },
    });
    await req.foundUser.updateOne({
      $push: { friendRequests: friendRequest._id },
    });
    let msgs = [];
    req.foundUser.notificationTokens.forEach((token) => {
      msgs.push({
        to: token,
        sound: "default",
        title: "New Friend Request",
        body: `${req.user.username} sent you a friend request`,
      });
    });
    await sendNotificationMsgs(msgs);

    res.status(201).json(friendRequest);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.acceptFriendRequest = async (req, res, next) => {
  try {
    const { friendRequestId } = req.params;
    const friendRequest = await FriendRequest.findById(
      friendRequestId
    ).populate("from");
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (!friendRequest.to.equals(req.user._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await req.user.updateOne({ $push: { friends: friendRequest.from } });
    await User.findByIdAndUpdate(friendRequest.from, {
      $push: { friends: req.user._id },
    });
    await User.findByIdAndUpdate(friendRequest.to, {
      $pull: { friendRequests: friendRequest._id },
    });
    await User.findByIdAndUpdate(friendRequest.from, {
      $pull: { friendRequests: friendRequest._id },
    });
    await friendRequest.deleteOne();
    let msgs = [];
    friendRequest.from.notificationTokens.forEach((token) => {
      msgs.push({
        to: token,
        sound: "default",
        title: "Friend Request Accepted",
        body: `${req.user.username} accepted your friend request`,
      });
    });
    await sendNotificationMsgs(msgs);

    res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.declineFriendRequest = async (req, res, next) => {
  try {
    const { friendRequestId } = req.params;
    const friendRequest = await FriendRequest.findById(friendRequestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (!friendRequest.to.equals(req.user._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await friendRequest.deleteOne();
    await User.findByIdAndUpdate(friendRequest.to, {
      $pull: { friendRequests: friendRequest._id },
    });
    await User.findByIdAndUpdate(friendRequest.from, {
      $pull: { friendRequests: friendRequest._id },
    });
    res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getMyFriendRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("friendRequests");
    return res.status(200).json(user.friendRequests);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.removeFriend = async (req, res, next) => {
  try {
    await req.user.updateOne({ $pull: { friends: req.foundUser._id } });
    await req.foundUser.updateOne({ $pull: { friends: req.user._id } });
    return res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};
