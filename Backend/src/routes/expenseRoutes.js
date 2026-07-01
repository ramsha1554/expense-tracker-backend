const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/role');
const validate = require('../middleware/validate');
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

const expenseValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category')
    .optional()
    .isIn(['Food', 'Travel', 'Bills', 'Shopping', 'Other'])
    .withMessage('Invalid category'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date')
];

router.post('/', expenseValidationRules, validate, createExpense);
router.get('/', getExpenses);
router.get('/monthly-total', getMonthlyTotal);
router.get('/admin/all', adminOnly, getAllExpensesAdmin);
router.get('/:id', param('id').isMongoId().withMessage('Invalid expense ID'), validate, getExpenseById);
router.put(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid expense ID'), ...expenseValidationRules.map(r => r.optional())],
  validate,
  updateExpense
);
router.delete('/:id', param('id').isMongoId().withMessage('Invalid expense ID'), validate, deleteExpense);

module.exports = router;