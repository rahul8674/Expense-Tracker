const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Validate environment variables
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.mongoURI;

if (!mongoURI) {
  console.error("❌ MongoDB connection string is missing in .env file.");
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// Import and use routes
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/auth", require("./routes/auth"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
