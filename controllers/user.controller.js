const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = './uploads/users/';

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory); 
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB file size limit
    },
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/gif'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false); 
        }
    }
}).single('photo'); 

class UserController {
    async getUser (req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    }
    async createUser (req, res) {
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Error uploading file' });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const { auth, name, lastname, filial } = req.body;
                const photo = req.file ? req.file.path : null; 

                const checkUser = await User.findOne({ auth });
                console.log(checkUser);
                if (checkUser) {
                    return res.status(400).json({ message: 'User with this auth already exists' });
                }

                const newUser = new User({
                    auth,
                    name,
                    lastname,
                    photo,
                    filial
                });

                await newUser.save();

                res.json({ message: 'User registered successfully', newUser });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }
    async updateUser (req, res) {
        try {
            const { id } = req.params;

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Error uploading file' });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const { auth, name, lastname, filial } = req.body;
                const photo = req.file ? req.file.path : undefined; 

                const updatedFields = {
                    auth,
                    name,
                    lastname,
                    filial
                };
                if (photo !== undefined) {
                    updatedFields.photo = photo;

                    const user = await User.findById(id);
    
                    if (user && user.photo) {
                        const filePath = path.join(__dirname, '..', user.photo);
    
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                            console.log(`Deleted photo: ${filePath}`);
                        } else {
                            console.log(`Photo topilmadi: ${filePath}`);
                        }
                    }
                }

                const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

                res.json({ updatedUser, message: 'User updated successfully' });
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
    async deleteUser (req, res) {
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.photo) {
                const filePath = path.join(__dirname, '..', user.photo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted photo: ${filePath}`);
                } else {
                    console.log(`File not found: ${filePath}`);
                }
            }

            await User.findByIdAndDelete(id);

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new UserController();
