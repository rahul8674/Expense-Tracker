const express = require("express");
const auth = require("../middleware/auth");
const Expense = require("../models/Expense");

const router = express.Router();

// Helper function to get user ID from request
const getUserId = (req) => req.user?.userId;

// GET all expenses for a user
router.get("/", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const expenses = await Expense.find({ user: userId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// POST a new expense
router.post("/", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, amount, date } = req.body;
    if (!title || !amount || !date) return res.status(400).json({ message: "All fields are required" });

    const expense = await Expense.create({ user: userId, title, amount, date });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
});

// DELETE an expense by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// UPDATE an expense by ID
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { title, amount, date } = req.body;

    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

    // Update only provided fields
    expense.set({ title, amount, date });

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
