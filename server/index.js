import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import "./config/passport.js";

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

import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

import githubRoutes from "./routes/auth.js";
app.use("/api/github", githubRoutes);

import watchRoute from "./routes/watch.js";
app.use("/api/watch", watchRoute);

import bookmarkRoutes from "./routes/bookmark.js";
app.use("/api/bookmark", bookmarkRoutes);

import githubAdmin from "./routes/github.js"
app.use("/api/github", githubAdmin);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
