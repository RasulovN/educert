const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/register', userController.regAuth);
router.post('/login', userController.loginAuth);

module.exports = router;
