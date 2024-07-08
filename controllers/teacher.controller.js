const Teacher = require('../models/Teacher');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const upload = multer({ dest: 'uploads/' });
const uploadDirectory = './uploads/teachers/';

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

class TeacherController {
      
    async getTeacher(req, res) {
        try {
            const teachers = await Teacher.find()
            .populate([
                {path: '_id', select: "auth name lastname about grade filial "}
            ])
            // .populate( '_id', "auth name lastname about grade filial " )
            console.log(teachers);
            res.json(teachers);
        } catch (error) {
            console.log('Error fetching teachers:', error);
            res.status(500).send('Server Error');
        }
    }

    async createTeacher(req, res) {
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Error uploading file' });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const { auth, name, lastname, grade, filial, about } = req.body;

                if (!auth || !name || !lastname || !grade || !filial) {
                    return res.status(400).json({ message: "All fields must be filled" });
                }
                const checkTeacher = await Teacher.findOne({ auth });
                if (checkTeacher) {
                    return res.status(400).json({ message: "Teacher with this auth already exists" });
                }

                const photo = req.file ? req.file.path : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

                const newTeacher = new Teacher({ 
                    auth, name, lastname, grade, filial, about, photo 
                });
                
                await newTeacher.save();
                
                res.json({ newTeacher, message: 'Teacher created successfully' });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    async updateTeacher(req, res) {
        upload(req, res, async function(err) {
            try {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Error uploading file' });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }
    
                const { id } = req.params;
                const { auth, name, lastname, grade, filial, about } = req.body;
                
                if (!auth || !name || !lastname || !grade || !filial) {
                    return res.status(400).json({ message: "All fields must be filled" });
                }
                
                const updatedFields = { auth, name, lastname, grade, filial, about };
                const photo = req.file ? req.file.path : undefined;
    
                if (photo !== undefined) {
                    updatedFields.photo = photo;
    
                    const teacher = await Teacher.findById(id);
    
                    if (teacher && teacher.photo) {
                        const filePath = path.join(__dirname, '..', teacher.photo);
    
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                            console.log(`Deleted photo: ${filePath}`);
                        } else {
                            console.log(`Photo topilmadi: ${filePath}`);
                        }
                    }
                }
    
                const updatedTeacher = await Teacher.findByIdAndUpdate(id, updatedFields, { new: true });
    
                res.json({ updatedTeacher, message: 'Teacher updated successfully' });
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }
        });
    }

    // Delete a teacher
    async deleteTeacher(req, res) {
        try {
            const { id } = req.params;
    
            const teacher = await Teacher.findById(id);
    
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher topilmadi' });
            }
    
            if (teacher.photo) {
                const filePath = path.join(__dirname, '..', teacher.photo);
    
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted photo: ${filePath}`);
                } else {
                    console.log(`Photo topilmadi: ${filePath}`);
                }
            }
    
            await Teacher.findByIdAndDelete(id);
    
            res.json({ message: 'Teacher deleted successfully' });
        } catch (error) {
            console.error('Error deleting teacher:', error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new TeacherController();
