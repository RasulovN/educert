const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
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
    filial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filial',
        required: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId, // fan idlari array buladi qaysi fanlarda uqiydi
        ref: 'Subject'
    }],
    groups: [{
        type: mongoose.Schema.Types.ObjectId, //guruh idilari qaysi guruhlarda uqiydi
        ref: 'Group'
    }]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
