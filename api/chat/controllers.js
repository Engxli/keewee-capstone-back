const Message = require("../../models/Message");
const PrivateChat = require("../../models/PrivateChat");
const User = require("../../models/User");
const PublicChat = require("../../models/PublicChat");

// exports.getMyChats = async (req, res, next) => {
//   try {
//     const chats = await User.findById(req.user._id)
//       .select("chats -_id")
//       .populate({
//         path: "chats",
//         populate: "members",
//         select: "updatedAt username _id image",
//       });
//     return res.status(200).json(chats.chats);
//   } catch (error) {
//     next(error);
//   }
// };

exports.getMyChats = async (req, res, next) => {
  try {
    const chats = await User.findById(req.user._id)
      .select("chats -_id")
      .populate({
        path: "chats",
        populate: [
          { path: "members", select: "username _id image" },
          {
            path: "msgs",
            ref: "Message",
            options: { sort: { createdAt: -1 }, limit: 1 },
            populate: { path: "from", select: "username _id" },
          },
        ],
        select: "updatedAt",
      });

    // You can further process the chats if needed, e.g., to reformat the messages.
    return res.status(200).json(chats.chats);
  } catch (error) {
    next(error);
  }
};

exports.getUserChat = async (req, res, next) => {
  try {
    if (req.user.chats.length >= 1) {
      const user = await req.user.populate("chats");

      const foundChat = user.chats.find((chat) => {
        return chat.members.find((member) => {
          return member.equals(req.foundUser._id);
        });
      });
      if (foundChat) {
        return res
          .status(200)
          .json(await foundChat.populate("members", "username image _id"));
      }
    }
    const createdChat = await PrivateChat.create({
      members: [req.user._id, req.foundUser._id],
    });
    await req.user.updateOne({ $push: { chats: createdChat._id } });
    await req.foundUser.updateOne({ $push: { chats: createdChat._id } });
    return res
      .status(201)
      .json(await createdChat.populate("members", "username image _id"));
  } catch (error) {
    next(error);
  }
};

exports.getChat = async (req, res, next) => {
  try {
    const chat = await PrivateChat.findById(req.params.chatId)
      .populate("members msgs", "username _id image")
      .populate({
        path: "msgs",
        populate: {
          path: "from",
          select: "image username",
        },
      });
    return res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

exports.sendChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const chat = await PrivateChat.findById(chatId);
    if (!chat) return next({ message: "chat not found!", status: 404 });
    const msg = await Message.create({
      from: req.user._id,
      privateChat: chat._id,
      text: req.body.msg,
    });
    await chat.updateOne({ $push: { msgs: msg } });
    return res.status(201).json(await msg.populate("from", "username image"));
  } catch (error) {
    next(error);
  }
};
/////////////////////////////////////////////////////////////
exports.getPublicChats = async (req, res, next) => {
  try {
    const chats = await PublicChat.find().populate("msgs");

    return res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

exports.getPlaceChat = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const chat = await PublicChat.findOne({ place: placeId })
      .populate("msgs")
      .populate({
        path: "msgs",
        populate: {
          path: "from",
          select: "image username",
        },
      });
    if (!chat) return next({ message: "Public chat not found!", status: 404 });
    return res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

exports.sendPublicChat = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const chat = await PublicChat.findOne({ place: placeId });
    if (!chat) return next({ message: "Public chat not found!", status: 404 });

    const msg = await Message.create({
      from: req.user._id,
      publicChat: chat._id,
      text: req.body.msg,
    });

    await chat.updateOne({ $push: { msgs: msg } });
    return res.status(201).json(await msg.populate("from", "username image"));
  } catch (error) {
    next(error);
  }
};
