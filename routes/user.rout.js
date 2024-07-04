const {Router} = require('express')
const router = Router()
const UserController = require('../controllers/user.controller');

// // User
// router.get('/', UserController.GET)
//         .post('/add', UserController.POST)
//         .put('/update/:id', UserController.PUT)
//         .delete('/delete/:id', UserController.DELETE);

router.get('/', UserController.getUser)
        .post('/add', UserController.createUser)
        .put('/update/:id', UserController.updateUser)
        .delete('/delete/:id', UserController.deleteUser);

module.exports = router;
