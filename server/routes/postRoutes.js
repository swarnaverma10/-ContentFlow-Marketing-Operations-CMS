const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../models/Post");
const slugify = require("slugify");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// CREATE POST
router.post("/create-post", upload.single("image"), async (req, res) => {
  try {
    let { title, content, status, metaTitle, metaDescription, category, tags, scheduledDate, readingTime, slug } = req.body;
    
    if (!slug) {
        slug = slugify(title, { lower: true, strict: true });
    }
    
    // Check if slug exists
    let existingPost = await Post.findOne({ slug });
    if (existingPost) {
        slug = `${slug}-${Date.now()}`;
    }

    const newPost = new Post({
      title,
      content,
      slug,
      status,
      category,
      tags: tags ? JSON.parse(tags) : [],
      scheduledDate: scheduledDate || undefined,
      readingTime: parseInt(readingTime) || 0,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      image: req.file ? req.file.filename : null,
    });

    await newPost.save();
    res.status(201).json({ message: "Post Created Successfully", post: newPost });
  } catch (error) {
    console.error("Backend Create Post Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET ALL POSTS (With filtering & sorting)
router.get("/posts", async (req, res) => {
  try {
    const { status, category, sort } = req.query;
    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "title") sortOption = { title: 1 };

    const posts = await Post.find(query).sort(sortOption);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE POST
router.put("/update-post/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, content, status, metaTitle, metaDescription, category, tags, scheduledDate, readingTime } = req.body;
    
    const updateData = {
      title,
      content,
      status,
      category,
      tags: tags ? JSON.parse(tags) : [],
      scheduledDate,
      readingTime: parseInt(readingTime) || 0,
      metaTitle,
      metaDescription,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Post Updated Successfully", post: updatedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DUPLICATE POST
router.post("/duplicate-post/:id", async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost) return res.status(404).json({ message: "Post not found" });

    const duplicatedPost = new Post({
      ...originalPost._doc,
      _id: undefined,
      title: `${originalPost.title} (Copy)`,
      slug: `${originalPost.slug}-copy-${Date.now()}`,
      status: "Draft",
      createdAt: undefined,
      updatedAt: undefined
    });

    await duplicatedPost.save();
    res.status(201).json({ message: "Post Duplicated Successfully", post: duplicatedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE POST
router.delete("/delete-post/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET SINGLE POST
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;