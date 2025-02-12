const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();
require("dotenv").config();

// Middleware for request validation
const validateRequest = (validations) => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
router.post(
  "/register",
  validateRequest([
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ]),
  async (req, res) => {
    const { name, email, password } = req.body;

    try {
      if (await User.findOne({ email })) 
        return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create({ name, email, password: hashedPassword });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// User Login
router.post(
  "/login",
  validateRequest([
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").notEmpty(),
  ]),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) 
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
