const Schdule = require("../models/schdule.model");
const WorkTime = require("../models/work-time.model");
const TimeModel = require('../models/time.model');
const Teacher = require('../models/teacher.model')
const Group = require('../models/group.model')

const getSchdules = async (req, res) => {
  try {
    const schdules = await Schdule.find()
      .populate("filial")
      .populate("time")
      .populate("room")
      .populate({
        path: "group",
        populate: ['teacher', 'subject']
      });
    res.json(schdules);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const createSchdule = async (req, res) => {
  try {
    const { filial, time, room, group } = req.body;

    if (!filial || !time || !room || !group) throw new Error("Malumot yetarli emas!");

    const { teacher } = await Group.findById(group)

    let isHaveSchdule = await Schdule.findOne({ filial, time, teacher });
    if (isHaveSchdule) throw new Error("Bu vaqtda ustoz bant!");

    isHaveSchdule = await Schdule.findOne({ filial, time, room });
    if (isHaveSchdule) throw new Error("Bu vaqtda xona bant!");

    isHaveSchdule = await Schdule.findOne({ filial, time, group });
    if (isHaveSchdule) throw new Error("Bu vaqtda guruh bant!");

    const workTime = await WorkTime.find({ teacher });
    if (!workTime) throw new Error("O'qituvchining ish vaqti topilmadi!");

    const timeDay = await TimeModel.findById(time);

    const teacherWorkTime = workTime.filter((item) => item.day === timeDay.day);
    if (!teacherWorkTime[0])
      throw new Error("Bu vaqt ustozning ish kuniga to'g'ri kelmaydi!");

    // *******************************************************
    const [appointmentStartHour, appointmentStartMinute] = timeDay.start
      .split(":")
      .map(Number);
    const [appointmentEndHour, appointmentEndMinute] = timeDay.end
      .split(":")
      .map(Number);
    const [workStartHour, workStartMinute] = teacherWorkTime[0].start
      .split(":")
      .map(Number);
    const [workEndHour, workEndMinute] = teacherWorkTime[0].end
      .split(":")
      .map(Number);

    const appointmentStartTime = new Date();
    appointmentStartTime.setHours(
      appointmentStartHour,
      appointmentStartMinute,
      0,
      0
    );

    const appointmentEndTime = new Date();
    appointmentEndTime.setHours(appointmentEndHour, appointmentEndMinute, 0, 0);

    const workStartTime = new Date();
    workStartTime.setHours(workStartHour, workStartMinute, 0, 0);

    const workEndTime = new Date();
    workEndTime.setHours(workEndHour, workEndMinute, 0, 0);

    if (
      appointmentStartTime < workStartTime ||
      appointmentStartTime >= workEndTime
    ) {
      throw new Error(
        "Darsning boshlang'ich vaqti o'qituvchining ish vaqti bilan to'g'ri kelmaydi!"
      );
    }

    if (
      appointmentEndTime < workStartTime ||
      appointmentEndTime > workEndTime
    ) {
      throw new Error(
        "Darsning tugash vaqti o'qituvchining ish vaqti bilan to'g'ri kelmaydi!"
      );
    }

    // **********************************************************
    let schdule = await Schdule.create({
      filial,
      time,
      room,
      group,
    });

    schdule = await Schdule.findById(schdule._id)
      .populate("filial")
      .populate("time")
      .populate("room")
      .populate({
        path: "group",
        populate: ['teacher', 'subject']
      });

    res.json({ message: "Malumot yaratildi!", schdule });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const changeSchdule = async (req, res) => {
  try {
    const { id } = req.params;
    const { filial, time, room, group } = req.body;

    let schdule = await Schdule.findById(id);

    if (!schdule) throw new Error("Malumot mavjut emas!");

    if (!filial || !time || !teacher || !room || !group || !subject)
      throw new Error("Malumot yetarli emas!");

    const { teacher } = await Group.findById(group);


    let isHaveSchdule = await Schdule.findOne({ filial, time, teacher });
    if (isHaveSchdule && isHaveSchdule._id.toString() !== id)
      throw new Error("Bu vaqtda ustoz bant!");

    isHaveSchdule = await Schdule.findOne({ filial, time, room });
    if (isHaveSchdule && isHaveSchdule._id.toString() !== id)
      throw new Error("Bu vaqtda xona bant!");

    isHaveSchdule = await Schdule.findOne({ filial, time, group });
    if (isHaveSchdule && isHaveSchdule._id.toString() !== id)
      throw new Error("Bu vaqtda guruh bant!");

    const workTime = await WorkTime.find({ teacher });
    if (!workTime) throw new Error("O'qituvchining ish vaqti topilmadi!");

    const timeDay = await TimeModel.findById(time);

    const teacherWorkTime = workTime.filter((item) => item.day === timeDay.day);
    if (!teacherWorkTime[0])
      throw new Error("Bu vaqt ustozning ish kuniga to'g'ri kelmaydi!");

    const [appointmentStartHour, appointmentStartMinute] = timeDay.start
      .split(":")
      .map(Number);
    const [appointmentEndHour, appointmentEndMinute] = timeDay.end
      .split(":")
      .map(Number);
    const [workStartHour, workStartMinute] = teacherWorkTime[0].start
      .split(":")
      .map(Number);
    const [workEndHour, workEndMinute] = teacherWorkTime[0].end
      .split(":")
      .map(Number);

    const appointmentStartTime = new Date();
    appointmentStartTime.setHours(
      appointmentStartHour,
      appointmentStartMinute,
      0,
      0
    );

    const appointmentEndTime = new Date();
    appointmentEndTime.setHours(appointmentEndHour, appointmentEndMinute, 0, 0);

    const workStartTime = new Date();
    workStartTime.setHours(workStartHour, workStartMinute, 0, 0);

    const workEndTime = new Date();
    workEndTime.setHours(workEndHour, workEndMinute, 0, 0);

    if (
      appointmentStartTime < workStartTime ||
      appointmentStartTime >= workEndTime
    ) {
      throw new Error(
        "Darsning boshlang'ich vaqti o'qituvchining ish vaqti bilan to'g'ri kelmaydi!"
      );
    }

    if (
      appointmentEndTime < workStartTime ||
      appointmentEndTime > workEndTime
    ) {
      throw new Error(
        "Darsning tugash vaqti o'qituvchining ish vaqti bilan to'g'ri kelmaydi!"
      );
    }

    schdule.filial = filial;
    schdule.time = time;
    schdule.room = room;
    schdule.group = group;

    await schdule.save();

    schdule = await Schdule.findById(schdule._id)
      .populate("filial")
      .populate("time")
      .populate("room")
      .populate({
        path: "group",
        populate:['teacher', 'subject']
      });

    res.json({ message: "Malumot yangilandi!", schdule });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const removeSchdule = async (req, res) => {
  try {
    const { id } = req.params;
    await Schdule.findByIdAndDelete(id);
    res.json({ message: "Malumot o'chirildi!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = { getSchdules, createSchdule, changeSchdule, removeSchdule };