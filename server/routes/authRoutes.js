const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // Check DB Connection
    if (mongoose.connection.readyState !== 1) {
        console.error("Database not connected. ReadyState:", mongoose.connection.readyState);
        return res.status(503).json({ message: "Database connection busy or unavailable. Please try again later." });
    }

    const { name, email, password } = req.body;
    console.log("Registration Attempt:", { name, email });
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    console.log("Checking if user exists...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.log("User already exists:", email);
        return res.status(400).json({ message: "Email is already registered" });
    }

    console.log("Hashing password...");
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    console.log("Saving user...");
    await user.save();
    console.log(`User Registered Successfully: ${email}`);
    res.status(201).json({ message: "User Registered Successfully" });

  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: "Email is already registered" });
    }
    console.error("Detailed Registration Server Error:", {
        message: error.message,
        stack: error.stack,
        body: req.body
    });
    res.status(500).json({ 
        message: "Server error occurred during registration", 
        error: error.message 
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { name: user.name, email: user.email } });

  } catch (error) {
    console.error("Login Server Error:", error);
    res.status(500).json({ message: "Server error occurred during login" });
  }
});

module.exports = router;