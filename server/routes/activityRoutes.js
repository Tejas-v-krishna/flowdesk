const express = require('express');
const { getRecentActivity } = require('../controllers/activityController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.get('/', getRecentActivity);

module.exports = router;
