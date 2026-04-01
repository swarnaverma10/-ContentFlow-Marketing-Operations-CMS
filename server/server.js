const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const Post = require("./models/Post");
require("dotenv").config();

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("MongoDB Connected ✅");
    // Run scheduler every minute
    cron.schedule("* * * * *", async () => {
        const now = new Date();
        const result = await Post.updateMany(
            { 
              status: "Scheduled", 
              scheduledDate: { $lte: now } 
            },
            { $set: { status: "Published" } }
        );
        if (result.modifiedCount > 0) {
            console.log(`Cron: Published ${result.modifiedCount} scheduled posts.`);
        }
    });
})
.catch((err) => console.log(err));

app.use("/api", postRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Smart CMS Backend Running 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});