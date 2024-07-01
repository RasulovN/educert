const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeSchema = new Schema({
    filial: {
        type: mongoose.Schema.Types.ObjectId, // filial id aysi filialga tegishli
        ref: 'Filial',
        required: true
    },
    start: {
        type: String, // boshlanish vaqti
        // type: Date, // boshlanish vaqti
        required: true
    },
    end: {
        type: String, // tugash vaqti
        required: true
    },
});

const Time = mongoose.model('Time', timeSchema);

module.exports = Time;
