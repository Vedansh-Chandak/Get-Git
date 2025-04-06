const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
require("./config/passport.js");

const app = express();

// CORS setup
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Middleware
app.use(express.json());

app.use(session({
    secret: "mysecret", // Replace with env variable in production
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ Error in connection", err));


//routes

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const githubRoutes = require("./routes/auth");
app.use("/api/github", githubRoutes);

const watchRoute = require("./routes/watch");
app.use("/api/watch", watchRoute);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
