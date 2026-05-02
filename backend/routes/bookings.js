const express = require('express');
const { createBooking, getMyBookings, getAllBookings, getBookingById } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, admin, getAllBookings);
router.route('/my-bookings').get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById);

module.exports = router;
