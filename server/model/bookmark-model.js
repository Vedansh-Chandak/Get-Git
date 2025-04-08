import mongoose from "mongoose";

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

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark