const Auth = require('../models/Auth');
const Student = require('../models/Student');
const path = require('path');
const { upload } = require('../middleware/FileUpload');
const  deleteFile  = require('../helpers/deleteFile');

const folderName = 'students';
const uploadMiddleware = upload(folderName);



class StudentController {
      //  Student
      async getStudent (req, res) {
        try {
            const students = await Student.find()
            .populate([
                {path: '_id', select: "auth name lastname filial subjects groups"}
            ])
            return res.status(200).json(students);
        } catch (error) {
            console.log('Error fetching students:', error);
        }
     }
     async createStudent(req, res) {
         try {
            uploadMiddleware(req, res, async function (err) {
                if (err) {
                    return res.status(400).send({ message: err.message });
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
                const savedStuden =await newStudent.save();
                return res.status(201).json({savedStuden});
                // res.json({newStudent, message: "Student muaffaqiyatli qo'shildi" });
            });
            } catch (error) {
                console.log(error);
                res.status(500).send('Server Error');
            }
        }
    
    async updateStudent(req, res) {
            try {
                uploadMiddleware(req, res, async function (err) {
                    if (err) {
                        return res.status(400).send({ message: err.message });
                    }
    
                const studentId = req.params.id;
                const { auth, name, lastname, filial, subjects, groups } = req.body;
    
                if (!auth || !name || !lastname || !filial || !subjects || !groups) {
                    return res.status(400).json({ message: 'Please fill in all fields' });
                }
                const photo = req.file ? req.file.path : undefined;
                const updatedFields = { auth, name, lastname, filial, subjects, groups, photo  };

                
                if (photo !== undefined) {
                    updatedFields.photo = photo;
                    
                    const student = await Student.findById(studentId);
                    if (student && student.photo) {
                        const filePath = path.join(__dirname, '..', student.photo);
                        deleteFile(filePath)
                        }
                }
    
                const updatedStudent = await Student.findByIdAndUpdate(studentId, updatedFields, { new: true });
    
                return res.status(201).json({ updatedStudent, message: "Student muaffaqiyatli yangilandi" });
            });
            } catch (error) {
                console.log(error);
                res.status(500).send('Server Error');
            }
    }
    
     async deleteStudent (req, res) {
        try {
            const studentId = req.params.id;
    
            const student = await Student.findById(studentId);
    
            if (!student) {
                return res.status(404).json({ message: 'Student topilmadi' });
            }
    
            if (student.photo) {
                const filePath = path.join(__dirname, '..', student.photo);
                deleteFile(filePath)
            }
            await Student.findByIdAndDelete(studentId);
    
            res.json({ message: "Student muaffaqiyatli o'chirildi" });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
     }
}


module.exports = new StudentController();