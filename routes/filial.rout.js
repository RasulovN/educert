const {Router} = require('express')
const router = Router()
const FilialController = require('../controllers/filial.controller');

// Filial
router.get('/', FilialController.getFilial)
        .post('/add', FilialController.createFilial)
        .put('/update/:id', FilialController.updateFilial)
        .delete('/delete/:id', FilialController.deleteFilial);

module.exports = router;
