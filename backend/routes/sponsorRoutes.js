const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsorController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', sponsorController.getAll);
router.post('/', authMiddleware, sponsorController.create);
router.put('/:id', authMiddleware, sponsorController.update);
router.delete('/:id', authMiddleware, sponsorController.delete);

module.exports = router;
