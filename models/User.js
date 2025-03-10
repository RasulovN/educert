
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;


    const userSchema = new Schema({
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
        photo:  {
            type: String,
            default:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        },
        filial: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Filial'
        }]
    });

    const User = mongoose.model('User', userSchema);
    module.exports = User;