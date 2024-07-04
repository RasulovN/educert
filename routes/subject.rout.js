const {Router} = require('express')
const router = Router()
const SubjectController = require('../controllers/subjct.conroller');

// Subject
router.get('/', SubjectController.getSubject)
        .post('/add', SubjectController.createSubject)
        .put('/update/:id', SubjectController.updateSubject)
        .delete('/delete/:id', SubjectController.deleteSubject);

module.exports = router;
