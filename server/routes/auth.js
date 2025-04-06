const express = require("express");
const passport = require('passport');
const router = express.Router();
const axios = require("axios");

router.get('/github', passport.authenticate("github", {scope: ["user:email"],prompt: "consent"}));

router.get("/search", async (req, res) => {
    const { q } = req.query;
    try {
      const response = await axios.get(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc`);
      res.json(response.data);
    } catch (error) {
      console.error("GitHub Search Error:", error.message);
      res.status(500).json({ error: "GitHub search failed" });
    }
  });

router.get("/github/callback", passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login",
}),
(req, res)=>{
    console.log("Github Auth Success")
    console.log(req.user);
    res.redirect("https://localhost:5173/");
});

router.get("/user", (req, res)=>{
 console.log("Checking user session ...")
 console.log(req.user);

    if(req.isAuthenticated()){
        res.json(req.user);
    }else{
        res.status(401).json({message: "Not authenticated"});
    }
});

router.get("/logout", (req, res)=>{
    req.logout((err)=>{
        if(err) return res.status(500).json({message: "Logout failed"})
            res.redirect("http://localhost:5173");
    })
})

module.exports = router;