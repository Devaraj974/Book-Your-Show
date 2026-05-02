const express = require('express');
const { getUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, admin, getUsers);

module.exports = router;
