const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    filial: {
        type: mongoose.Schema.Types.ObjectId, //filial id aysi filialga tegishli
        ref: 'Filial',
        required: true
    },
    number: {
        type: String, /// xonani raqami yoki nomi
        required: true
    },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
