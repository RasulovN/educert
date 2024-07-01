// const User = require('../models/User');
const Auth = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class UserController {
    async regAuth(req, res) {
        try {
            const { phone, password } = req.body;
    
            let user = await Auth.findOne({ phone });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }
    
            user = new Auth({ phone, password });
            
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
    
            await user.save();
    
            res.json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
    async loginAuth(req, res) {
        try {
            const { phone, password } = req.body;
    
            let user = await Auth.findOne({ phone });
            if (!user) {
                return res.status(400).json({ message: "Password yoki telefon raqami noto'g'ri" });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Password yoki telefon raqami noto'g'ri" });
            }
    
            // Create and return JWT token
            const payload = {
                user: {
                    id: user.id
                }
            };
    
            jwt.sign(payload, 'secretkey', { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
                res.json({ token, message: "nice" }, );
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new UserController();