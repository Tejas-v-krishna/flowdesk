const express = require('express');
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary
} = require('../controllers/financeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/summary', getSummary);
router.get('/', getTransactions);
router.post('/', createTransaction);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
