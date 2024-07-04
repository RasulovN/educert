const {Router} = require('express')
const router = Router()
const GroupController = require('../controllers/group.controller');

// Group
router.get('/', GroupController.getGroup)
        .post('/add', GroupController.createGroup)
        .put('/update/:id', GroupController.updateGroup)
        .delete('/delete/:id', GroupController.deleteGroup);

module.exports = router;
