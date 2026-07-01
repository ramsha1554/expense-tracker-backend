const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/role');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlyTotal,
  getAllExpensesAdmin
} = require('../controllers/expenseController');

router.use(protect);

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/monthly-total', getMonthlyTotal);
router.get('/admin/all', adminOnly, getAllExpensesAdmin);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;