const {Router} = require('express')
const router = Router()
const TimeController = require('../controllers/time.controller');

// Time
router.get('/', TimeController.getTime)
        .post('/add', TimeController.createTime)
        .put('/update/:id', TimeController.updateTime)
        .delete('/delete/:id', TimeController.deleteTime);

module.exports = router;
