const { Schema, model } = require('mongoose')


const WorkTimeSchema = new Schema({
  day: {
    type: String,
    required: true,
    enum: ['dushanba', 'seshanba', 'chorchanba', 'payshanba', 'juma', 'shanba', 'yakshanba']
  },
  start: {
    type: String,
    reuired: true,
  },
  end: {
    type: String,
    reuired: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
    default: null,
  },
});


module.exports = model('WorkTime', WorkTimeSchema)