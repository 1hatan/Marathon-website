const express = require('express');
const router = express.Router();
const raceController = require('../controllers/raceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', raceController.getAll);
router.post('/', authMiddleware, raceController.create);
router.put('/:id', authMiddleware, raceController.update);
router.delete('/:id', authMiddleware, raceController.delete);

module.exports = router;
