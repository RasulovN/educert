const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filialSchema = new Schema({
    title: {
        type: String, //filial nomi
        required: true
    },
    address: {
        type: String, //filial manzili
        required: true
    },
});

const Filial = mongoose.model('Filial', filialSchema);

module.exports = Filial;
