import express from "express"
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import { request , gql } from  "graphql-request"

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// ✅ Route 1: Get user info, repos, followers, following
router.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const [userRes, reposRes, followersRes, followingRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos`),
      axios.get(`https://api.github.com/users/${username}/followers`),
      axios.get(`https://api.github.com/users/${username}/following`)
    ]);

    res.status(200).json({
      user: userRes.data,
      repos: reposRes.data,
      followers: followersRes.data,
      following: followingRes.data
    });
  } catch (err) {
    console.error("GitHub API error", err);
    res.status(500).json({ message: "Failed to fetch GitHub user data" });
  }
});

// ✅ Route 2: Get contribution graph data
router.get("/contributions/:username", async (req, res) => {
  const { username } = req.params;

  const query = gql`
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await request(
      GITHUB_GRAPHQL_URL,
      query,
      { username },
      {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      }
    );

    const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
    const days = weeks.flatMap((week) => week.contributionDays);
    const formatted = days.map((d) => ({
      date: d.date,
      count: d.contributionCount,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching contributions:", error.message);
    res.status(500).json({ message: "Failed to fetch contributions" });
  }
});

export default router;
