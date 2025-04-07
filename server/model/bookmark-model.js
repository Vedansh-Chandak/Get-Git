const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  repoId: {
    type: String,
    required: true,
  },
  repoName: String,
  htmlUrl: String,
  stars: Number,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
