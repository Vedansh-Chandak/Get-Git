const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos`);
    const followersRes = await axios.get(`https://api.github.com/users/${username}/followers`);
    const followingRes = await axios.get(`https://api.github.com/users/${username}/following`);

    res.status(200).json({
      user: userRes.data,
      repos: reposRes.data,
      followers: followersRes.data,
      following: followingRes.data,
    });
  } catch (err) {
    console.error("GitHub API error", err);
    res.status(500).json({ message: "Failed to fetch GitHub user data" });
  }
});

module.exports = router;
