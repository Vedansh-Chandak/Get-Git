const express = require("express");
const router = express.Router();
const Bookmark = require("../model/bookmark-model.js");

router.post("/", async (req, res) => {
  const { userId, repoId, repoName, htmlUrl, stars, description } = req.body;

  try {
    const existing = await Bookmark.findOne({ userId, repoId });
    if (existing) {
      return res.status(200).json({ message: "Repository already bookmarked" }); // return added
    }

    const newBookmark = new Bookmark({
      userId,
      repoId,
      repoName,
      htmlUrl,
      stars,
      description
    });

    await newBookmark.save();
    res.status(201).json(newBookmark);
  } catch (error) {
    console.error("Bookmark Error:", error);
    res.status(501).json({ message: "Failed to save bookmark" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.params.userId });
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(501).json({ message: "Failed to fetch bookmarks" });
  }
});

router.delete("/:userId/:repoId", async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({
      userId: req.params.userId,
      repoId: req.params.repoId
    });
    res.status(200).json({ message: "Bookmark removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bookmark" });
  }
});

module.exports = router;
