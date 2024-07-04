const {Router} = require('express')
const router = Router()
const TeacherController = require('../controllers/teacher.controller');

// Teacher
router.get('/', TeacherController.getTeacher)
        .post('/add', TeacherController.createTeacher)
        .put('/update/:id', TeacherController.updateTeacher)
        .delete('/delete/:id', TeacherController.deleteTeacher);

module.exports = router;
