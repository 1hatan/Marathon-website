const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for new registration
router.post('/', participantController.create);

// Public/Admin route to get registration pass by registration ID or internal ID
router.get('/:id', participantController.getById);

// Admin protected routes
router.get('/', authMiddleware, participantController.getAll);
router.put('/:id', authMiddleware, participantController.update);
router.delete('/:id', authMiddleware, participantController.delete);

module.exports = router;
