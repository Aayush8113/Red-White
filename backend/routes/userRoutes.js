const express = require('express');
const { authUser, registerUser } = require('../controllers/userController');
const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);

module.exports = router;
