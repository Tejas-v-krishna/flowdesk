const express = require('express');
const {
    getNotes,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/noteController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', getNotes);
router.post('/', createNote);
router.patch('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
