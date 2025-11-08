const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    if (!title || !amount || !category) {
      return res
        .status(400)
        .json({ message: "Title, amount, and category are required." });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: date || Date.now(),
      description,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error("Add Expense Error:", err);
    res.status(500).json({ message: "Server error adding expense" });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
      createdAt: -1,
    });

    res.json(expenses);
  } catch (err) {
    console.error("Get Expenses Error:", err);
    res.status(500).json({ message: "Server error fetching expenses" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    console.log("Found expense:", expense);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this expense" });
    }

    const fields = ["title", "amount", "category", "date", "description"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) expense[f] = req.body[f];
    });

    const updated = await expense.save();
    res.json(updated);
  } catch (err) {
    console.error("Update Expense Error:", err);
    res.status(500).json({ message: "Server error updating expense" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this expense" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Delete Expense Error:", err);
    res.status(500).json({ message: "Server error deleting expense" });
  }
};

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense };
