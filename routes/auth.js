const express = require('express');
const router = express.Router();
const { isAuth , checkUser } = require('../middleware/auth');


const userController = require('../controllers/auth.controller');

router.get('/', userController.getAuth);
router.post('/register', userController.regAuth);
router.post('/login', checkUser, userController.loginAuth);
router.put('/update/:id', isAuth, userController.updateAuth);
// router.put('/delete/:id', isAdmin, userController.updateAuth);

//logout
router.get('/logout', (req, res) => {
    // req.session.user = undefined
    // req.session.isLogged = false
    // req.session.destroy()
    res.redirect('/')
})

// router.post('/logout', userController.logOut);

module.exports = router;
