const express = require('express');
const {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
} = require('../controllers/goalsController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', getGoals);
router.post('/', createGoal);
router.patch('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
