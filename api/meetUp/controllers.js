const MeetUpRequest = require("../../models/MeetUpRequest");
const User = require("../../models/User");

exports.createMeetUpRequest = async (req, res, next) => {
  try {
    if (req.user._id.equals(req.foundUser._id)) {
      return res
        .status(400)
        .json({ message: "You can't send a meetup request to yourself!" });
    }

    const meetupRequest = await MeetUpRequest.create({
      from: req.user._id,
      to: req.foundUser._id,
    });
    await req.user.updateOne({ $push: { meetupRequests: meetupRequest._id } });
    await req.foundUser.updateOne({
      $push: { meetupRequests: meetupRequest._id },
    });
    res.status(201).json(meetupRequest);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.acceptMeetUpRequest = async (req, res, next) => {
  try {
    if (!req.meetUpRequest.to.equals(req.user._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await User.findByIdAndUpdate(req.meetUpRequest.to, {
      $pull: { meetupRequests: req.meetUpRequest._id },
    });
    await User.findByIdAndUpdate(req.meetUpRequest.from, {
      $pull: { meetupRequests: req.meetUpRequest._id },
    });
    await req.meetUpRequest.deleteOne();
    res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.declineMeetUpRequest = async (req, res, next) => {
  try {
    if (!req.meetUpRequest.to.equals(req.user._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await req.meetUpRequest.deleteOne();
    await User.findByIdAndUpdate(req.meetUpRequest.to, {
      $pull: { meetupRequests: req.meetUpRequest._id },
    });
    await User.findByIdAndUpdate(req.meetUpRequest.from, {
      $pull: { meetupRequests: req.meetUpRequest._id },
    });
    res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getMyMeetUpRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("meetupRequests");
    return res.status(200).json(user.meetupRequests);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};
