const {Router} = require('express')
const router = Router()


// Auth
router.use("/auth", require("./auth"))

// Filial
router.use('/filials', require("./filial.rout"));

// Rooms
router.use('/rooms', require("./room.rout"));

// group
router.use('/groups', require("./group.rout"));

// Subject
router.use('/subjects', require("./subject.rout"));

// User
router.use('/users', require("./user.rout"));

// Teacher
router.use('/teachers', require("./teacher.rout"));

// Student
router.use('/students',require("./student.rout"));

// Time
router.use('/times', require("./time.rout"));




module.exports = router;
