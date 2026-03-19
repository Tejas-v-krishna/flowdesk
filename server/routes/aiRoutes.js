const express = require('express');
const { chat, getSuggestions } = require('../controllers/aiController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.post('/chat', chat);
router.get('/suggestions', getSuggestions);

module.exports = router;
