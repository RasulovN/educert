const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/auth');


const userController = require('../controllers/auth.controller');

router.post('/register', userController.regAuth);
router.post('/login', isAuth, userController.loginAuth);

//logout
router.get('/logout', (req, res) => {
    req.session.user = undefined
    req.session.isLogged = false
    req.session.destroy()
    res.redirect('/')
})

// router.post('/logout', userController.logOut);

module.exports = router;
