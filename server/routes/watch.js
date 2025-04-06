const express = require("express");
const router = express.Router();
const WatchHistory = require("../model/watch-model.js");

// Save watched repo
router.post("/", async (req, res) => {
  const { userId, repoName, repoUrl, stars } = req.body;
  try {
    const history = new WatchHistory({
      userId,
      repoName,
      repoUrl,
      stars,
    });
    await history.save();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to save watch history" });
  }
});

// Get top 5 watched repos for user
router.get('/:userId', async (req, res) => {
  try {
    const history = await WatchHistory.find({ userId: req.params.userId })
      .sort({ watchedAt: -1 })
      .limit(5);
    res.status(200).json(history);
  } catch (error) {
    res.status(501).json({ message: "Failed to fetch watch history" });
  }
});

module.exports = router;
