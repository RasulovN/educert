const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

// Filial
router.get('/filials', postController.getFiial)
        .post('/create-filial', postController.createFilial)
        .put('/update-filial/:id', postController.updateFiial)
        .delete('/filial/:id', postController.deleteFiial);

// Rooms
router.get('/rooms', postController.getRooms)
        .post('/create-room', postController.createRoom)
        .put('/update-room/:id', postController.updateRoom)
        .delete('/delete-room/:id', postController.deleteRoom);

// group
router.get('/groups', postController.getGroup)
        .post('/create-group', postController.createGroup)
        .put('/update-group/:id', postController.updateGroup)
        .delete('/delete-group/:id', postController.deleteGroup);

// Subject
router.get('/subjects', postController.getSubject)
        .post('/create-subject', postController.createSubject)
        .put('/update-subject/:id', postController.updateSubject)
        .delete('/delete-subject/:id', postController.deleteSubject);
// User
router.get('/users', postController.getUser)
        .post('/create-user', postController.createUser)
        .put('/update-user/:id', postController.updateUser)
        .delete('/delete-user/:id', postController.deleteUser);
// Teacher
router.get('/teachers', postController.getTeacher)
        .post('/create-teacher', postController.createTeacher)
        .put('/update-teacher/:id', postController.updateTeacher)
        .delete('/delete-teacher/:id', postController.deleteTeacher);
// Student
router.get('/students', postController.getStudent)
        .post('/create-student', postController.createStudent)
        .put('/update-student/:id', postController.updateStudent)
        .delete('/delete-student/:id', postController.deleteStudent);

// Time
router.get('/times', postController.getTime)
        .post('/create-time', postController.createTime)
        .put('/update-time/:id', postController.updateTime)
        .delete('/delete-time/:id', postController.deleteTime);





module.exports = router;
