const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const Post = require("./models/Post");
require("dotenv").config();

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const allowedOrigins = [
  "https://content-flow-marketing-opera-git-a38ad0-swarnaverma10s-projects.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URL)
  .then(function () {
    console.log("MongoDB Connected");
    cron.schedule("* * * * *", async function () {
      const now = new Date();
      const result = await Post.updateMany(
        {
          status: "Scheduled",
          scheduledDate: { $lte: now }
        },
        { $set: { status: "Published" } }
      );
      if (result.modifiedCount > 0) {
        console.log("Cron: Published " + result.modifiedCount + " scheduled posts.");
      }
    });
  })
  .catch(function (err) { console.log(err); });

app.use("/api", postRoutes);
app.use("/api/auth", authRoutes);

app.get("/", function (req, res) {
  res.send("Smart CMS Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", function () {
  console.log("Server running on port " + PORT);
});