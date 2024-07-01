const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    phone: {
        type: String, 
        required: true,
        unique: true
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
