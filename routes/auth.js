const express = require('express');
const router = express.Router();
const { isAuth , checkUser } = require('../middleware/auth');


const userController = require('../controllers/auth.controller');

router.post('/register', userController.regAuth);
router.post('/login', checkUser, userController.loginAuth);
router.put('/update/:id', isAuth, userController.updateAuth);
// router.put('/delete/:id', isAmin, userController.updateAuth);

//logout
router.get('/logout', (req, res) => {
    // req.session.user = undefined
    // req.session.isLogged = false
    // req.session.destroy()
    res.redirect('/')
})

// router.post('/logout', userController.logOut);

module.exports = router;
