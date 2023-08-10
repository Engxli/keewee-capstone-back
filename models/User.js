const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    location: { lon: { String }, lat: { String } },

    // relation
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    history: [{ type: Schema.Types.ObjectId, ref: "History" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    mood: { type: Schema.Types.ObjectId, ref: "Mood" },
    chats: [{ type: Schema.Types.ObjectId, ref: "PrivateChat" }],
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    friendRequest: [{ type: Schema.Types.ObjectId, ref: "FriendRequest" }],
    notificationTokens: [{ type: String, unique: true }],
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
