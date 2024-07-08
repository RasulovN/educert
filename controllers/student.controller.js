const Auth = require('../models/Auth');
const Student = require('../models/Student');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = './uploads/students/';

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



class StudentController {
      //  Student
      async getStudent (req, res) {
        try {
            const students = await Student.find()
            // .populate('subjects')
            // .populate('filial')
            // .populate('groups')
            // .populate('groups')
            // const students = await Student.find();
            return res.status(200).json(students);
        } catch (error) {
            console.log('Error fetching students:', error);
        }
     }
     async createStudent(req, res) {
         try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Error uploading file' });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }
    
                const { auth, name, lastname, filial, subjects, groups } = req.body;
                if (!auth || !name || !lastname || !filial || !subjects || !groups) {
                    return res.status(400).json({ message: "Hamma maydon to'ldirilishi shart" });
                }
                const existingStudent = await Student.findOne({ auth });
                if (existingStudent) {
                    return res.status(400).json({ message: 'Bunday auth li talaba allaqachon mavjud' });
                }
    
    
                const photo = req.file ? req.file.path : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    
                const newStudent = new Student({ auth, name, lastname, filial, subjects, groups, photo });
                await newStudent.save();
                res.json({newStudent, message: "Student muaffaqiyatli qo'shildi" });
            });
            } catch (error) {
                console.log(error);
                res.status(500).send('Server Error');
            }
        }
    
    async updateStudent(req, res) {
        upload(req, res, async function (err) {
            try {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Error uploading file' });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }
    
                const studentId = req.params.id;
                const { auth, name, lastname, filial, subjects, groups } = req.body;
    
                // Validate if required fields are present
                if (!auth || !name || !lastname || !filial || !subjects || !groups) {
                    return res.status(400).json({ message: 'Please fill in all fields' });
                }
    
                // Find the student by ID
                const student = await Student.findById(studentId);
    
                // Handle photo update
                let photo = student.photo; // Default to existing photo if no new file uploaded
    
                if (req.file) {
                    // New file uploaded, update photo URL
                    photo = req.file.path;
    
                    // Delete old photo file if it exists
                    if (student.photo) {
                        const filePath = path.join(__dirname, '..', student.photo);
    
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                            console.log(`Deleted photo: ${filePath}`);
                        } else {
                            console.log(`Photo not found: ${filePath}`);
                        }
                    }
                }
    
                // Update the student document
                const updatedStudent = await Student.findByIdAndUpdate(studentId, {
                    auth, name, lastname, filial, subjects, groups, photo
                }, { new: true });
    
                res.json({ updatedStudent, message: "Student muaffaqiyatli yangilandi" });
            } catch (error) {
                console.log(error);
                res.status(500).send('Server Error');
            }
        });
    }
    
     async deleteStudent (req, res) {
        try {
            const studentId = req.params.id;
    
            await Student.findByIdAndDelete(studentId);
    
            res.json({ message: "Student muaffaqiyatli o'chirildi" });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
     }
}


module.exports = new StudentController();