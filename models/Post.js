const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const PostSchema = new Schema(
  {
    image: { type: String, required: true },
    mood: { type: Schema.Types.ObjectId, ref: "Mood" },
    rate: { type: Schema.Types.ObjectId, ref: "Rating" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Post", PostSchema);
