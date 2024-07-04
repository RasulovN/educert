const {Router} = require('express')
const router = Router()
const StudentController = require('../controllers/student.controller');

// Student
router.get('/', StudentController.getStudent)
        .post('/add', StudentController.createStudent)
        .put('/update/:id', StudentController.updateStudent)
        .delete('/delete/:id', StudentController.deleteStudent);

module.exports = router;
