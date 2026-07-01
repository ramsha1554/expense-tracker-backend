const Expense = require('../models/Expense');

const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ success: false, message: 'Title and amount are required' });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      date
    });

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    const filter = { user: req.user.id };

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const { title, amount, category, date } = req.body;

    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;

    await expense.save();

    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.status(200).json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMonthlyTotal = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.status(200).json({ success: true, month: now.getMonth() + 1, year: now.getFullYear(), total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllExpensesAdmin = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('user', 'name email role').sort({ date: -1 });

    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlyTotal,
  getAllExpensesAdmin
};