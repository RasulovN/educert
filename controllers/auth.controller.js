// const User = require('../models/User');
const Auth = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class UserController {
    async regAuth(req, res) {
        try {
            const { phone, password, confirmPassword } = req.body;
            
            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            
            if (phone.length <= 3) {
                return res.status(400).json({ message: 'Phone number must be at least 4 characters long' });
            }
    
            let user = await Auth.findOne({ phone });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }
    
            user = new Auth({ phone, password });
    
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
    
            await user.save();
    
            const payload = {
                user: {
                    id: user.id
                }
            };
    
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '2h' });
    
            res.json({ token, message: 'User registered successfully' });
            
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async loginAuth(req, res) {
        try {
            const { phone, password } = req.body;
            let user = await Auth.findOne({ phone }).select(['login', 'name', 'role', 'password']);
            if (!user) {
                return res.status(400).json({ message: "Password yoki telefon raqami noto'g'ri" }); //user mavjud emas
            }
    
            const isMatch = await bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Password yoki telefon raqami mos emas" }); //password check
            }
    
            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '2h' }, (err, token) => {
                if (err) throw err;
                res.status(200).json({ token, message: "Token 2 soat uchun" });
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
    async logOut(req, res){
        try {
            res.json({ message: 'Logout successful' });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }


    async updateAuth(req, res){
        const { id } = req.params;
        const { phone, password, role } = req.body;
    
        try {
            let user = await Auth.findById(id);
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            if (phone) user.phone = phone;
            if (role) user.role = role;
    
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                user.password = hashedPassword;
            }
    
            const updatedAuth = await user.save();
    
            res.json({updatedAuth, message: 'User updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
    async deleteAcoount(req, res){
        try {
            const authId = req.params.id;
             await Auth.findByIdAndDelete(authId);
    
            res.json({ message: "Auth muvaffaqiyatli yangilandi o'chirildi" });;
        } catch (error) {
           console.log(error);
        }
    }
}

module.exports = new UserController();