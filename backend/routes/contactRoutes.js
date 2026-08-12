const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', contactController.create);
router.get('/', authMiddleware, contactController.getAll);
router.put('/:id', authMiddleware, contactController.updateStatus);
router.delete('/:id', authMiddleware, contactController.delete);

module.exports = router;
