const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', faqController.getAll);
router.post('/', authMiddleware, faqController.create);
router.put('/:id', authMiddleware, faqController.update);
router.delete('/:id', authMiddleware, faqController.delete);

module.exports = router;
