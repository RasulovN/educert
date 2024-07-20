const router = require('express').Router()
const { getWorkTimes, getWorkTimesOneTeacher, createWorkTime, changeWorkTime, removeWorkTime } = require('../controllers/work-time.controller');
const  { isAuth } = require('../middleware/auth.middleware')

router.get("/worktimes", isAuth, getWorkTimes);
router.get("/worktimes/teacher/:id", isAuth, getWorkTimesOneTeacher);
router.post('/worktimes/add', isAuth, createWorkTime)
router.put('/worktimes/update/:id', isAuth, changeWorkTime)
router.delete("/worktimes/delete/:id", isAuth, removeWorkTime);



module.exports = router