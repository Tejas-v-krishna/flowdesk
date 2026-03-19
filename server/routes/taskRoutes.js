const express = require('express');
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    bulkUpdateTasks
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', getTasks);
router.post('/', createTask);
router.post('/bulk', bulkUpdateTasks);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
