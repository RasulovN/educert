const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    auth: {
        type: mongoose.Schema.Types.ObjectId, //auth modeli idsi ref holatida biriktirish foydalanuvchi tizimga kira olishi uchun
        ref: 'Auth',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    photo: {
        type: String,
    },
    about: {
        type: String,
    },
    grade: {
        type: String, // darajasi string
        required: true
    },
    filial: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filial'
    }]
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
