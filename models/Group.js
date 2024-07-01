const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId, // teacherni idsi keladi
        ref: 'Teacher',
        required: true
    },
    title: {
        type: String, // guruh nomi
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId, //qaysi fan
        ref: 'Subject',
        required: true
    },
    filial: {
        type: mongoose.Schema.Types.ObjectId, // filial id qaysi filialga tegishli
        ref: 'Filial',
        required: true
    },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
