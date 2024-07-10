const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { upload } = require('../middleware/FileUpload');
const  deleteFile  = require('../helpers/deleteFile');

const folderName = 'users';
const uploadMiddleware = upload(folderName);

class UserController {
    async getUser (req, res) {
        try {
            const users = await User.find()
            .populate([
                {path: '_id', select: "auth name lastname filial"}
            ]) 
            res.json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    }
    async createUser (req, res) {
        try {
            uploadMiddleware(req, res, async function (err) {
                if (err) {
                    return res.status(400).send({ message: err.message });
                }

                const { auth, name, lastname, filial } = req.body;
                const photo = req.file ? req.file.path : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'; 

                const checkUser = await User.findOne({ auth });
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

                return res.status(201).json({ message: 'User registered successfully', newUser });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }
    async updateUser (req, res) {
        try {
            uploadMiddleware(req, res, async function (err) {
                if (err) {
                    return res.status(400).send({ message: err.message });
                }
                
                const { id } = req.params;
                const { auth, name, lastname, filial } = req.body;
                if (!auth || !name || !lastname || !filial) {
                    return res.status(400).json({ message: "All fields must be filled" });
                }
                
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
                        deleteFile(filePath)
                    }
                }

                const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

                return res.status(201).json({ updatedUser, message: 'User updated successfully' });
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
                    deleteFile(filePath)
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
