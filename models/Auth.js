const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    // username: {
    //     type: String, 
    //     required: true,
    //     unique: true,
    //     minlength: 3,
    //     maxlength: 255,
    // },
    phone: {
        type: String, 
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String, ////admin panelni boshqarish uchun role enam holatida [admin user student operator accountant]
        enum: ['admin', 'user', 'student', 'operator', 'accountant'],
        default: 'user'
    }
});



const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth
