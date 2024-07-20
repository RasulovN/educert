const WorkTime = require("../models/work-time.model");

const getWorkTimes = async (req, res) => {
  try {
    const worktimes = await WorkTime.find().populate("teacher");
    res.json(worktimes);
  } catch (error) {
    res.json(error.message);
  }
};

const getWorkTimesOneTeacher = async (req, res) => {
    try {
        const { id } = req.params
        const worktimes = await WorkTime.find({ teacher: id }).populate('teacher')
        res.json(worktimes)
    } catch (error) {
        res.json({ message: error.message })
    }
}

const createWorkTime = async (req, res) => {
  try {
    const { day, start, end, teacher } = req.body;

    const isHaveWorktime = await WorkTime.findOne({ day, teacher })
    if(isHaveWorktime) throw new Error('Bu kunga vaqt belgilangan!')

    if (!day || !start || !end || !teacher)
      throw new Error("Malumot yetarli emas!");

    let worktime = await WorkTime.create({ day, start, end, teacher });
    worktime = await WorkTime.findById(worktime._id).populate("teacher");

    res.json({ message: "Malumot yaratildi!", worktime });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const changeWorkTime = async (req, res) => {
    try {
        const { id } = req.params
        const { day, start, end, teacher } = req.body

        if(!teacher || !day) throw new Error('Maydonda ustoz va kun belgilanishi shart!')

        let worktime = await WorkTime.findById(id)
        if (!worktime) throw new Error("Malumot mavjut emas!");

        const isHaveWorktime = await WorkTime.findOne({ day, teacher });
        if (isHaveWorktime) throw new Error("Bu kunga vaqt belgilangan!");

        if(day) worktime.day = day
        if(start) worktime.start = start
        if(end) worktime.end = end
        if(teacher) worktime.teacher = teacher

        await worktime.save()
        worktime = await WorkTime.findById(id).populate('teacher')
        res.json({ message: "Malumot yangilandi!", worktime })

    } catch (error) {
        res.json({ message: error.message })
    }
}

const removeWorkTime = async (req, res) => {
    try {
        const { id } = req.params
        const worktime = await WorkTime.findByIdAndDelete(id)
        res.json({ message: 'Malumot o\'chirildi!', worktime })
    } catch (error) {
        res.json({ message: error.message })
    }
}

module.exports = {
  getWorkTimes,
  createWorkTime,
  changeWorkTime,
  removeWorkTime,
  getWorkTimesOneTeacher,
};