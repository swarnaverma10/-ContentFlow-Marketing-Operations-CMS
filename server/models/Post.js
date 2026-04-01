const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Draft", "Published", "Scheduled"],
    default: "Draft",
  },
  category: {
    type: String,
    default: "General"
  },
  tags: [String],
  scheduledDate: {
    type: Date
  },
  readingTime: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);