const express = require('express');
const { getTheaters, createTheater, updateTheater, deleteTheater } = require('../controllers/theaterController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getTheaters).post(protect, admin, createTheater);
router.route('/:id')
    .put(protect, admin, updateTheater)
    .delete(protect, admin, deleteTheater);

module.exports = router;
