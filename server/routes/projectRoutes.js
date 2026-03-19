const express = require('express');
const {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
