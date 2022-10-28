const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
