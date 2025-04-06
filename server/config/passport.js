const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/api/auth/github/callback", // ✅ Updated for port 8000
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile); // Send GitHub profile
}));

passport.serializeUser((user, done) => {
  done(null, user); // ✅ Save whole user object in session
});

passport.deserializeUser((user, done) => {
  done(null, user); // ✅ Return the same user from session
});
