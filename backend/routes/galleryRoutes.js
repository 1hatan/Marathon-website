const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', galleryController.getAll);
router.post('/', authMiddleware, galleryController.create);
router.put('/:id', authMiddleware, galleryController.update);
router.delete('/:id', authMiddleware, galleryController.delete);

module.exports = router;
