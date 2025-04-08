import mongoose from "mongoose";

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

const WatchHistory = mongoose.model("WatchHistory", watchSchema);
export default WatchHistory;