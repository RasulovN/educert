const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    title: {
        type: String, //o'quv yunalish nomi
        required: true
    },
    filial: {
        type: mongoose.Schema.Types.ObjectId, // filial id aysi filialga tegishli
        ref: 'Filial',
        required: true
    },
    photo: {
        type: String,
        default:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      },
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
