const mongoose = require("mongoose");

const watchSchema = new mongoose.Schema({
  userId: String,
  repoName: String,
  repoUrl: String,
  stars: Number,
  watchedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("WatchHistory", watchSchema);
