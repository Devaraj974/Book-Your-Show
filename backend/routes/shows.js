const express = require('express');
const { getShowsByMovie, getShowById, createShow, getShows, updateShow, deleteShow } = require('../controllers/showController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getShows)
    .post(protect, admin, createShow);

router.route('/movie/:movieId').get(getShowsByMovie);

router.route('/:id')
    .get(getShowById)
    .put(protect, admin, updateShow)
    .delete(protect, admin, deleteShow);

module.exports = router;
