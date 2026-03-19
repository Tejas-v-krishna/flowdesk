const express = require('express');
const { getSummary, getHeatmap } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/summary', getSummary);
router.get('/heatmap', getHeatmap);

module.exports = router;
