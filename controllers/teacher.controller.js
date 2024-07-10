const Teacher = require('../models/Teacher');
const path = require('path');
const { upload } = require('../middleware/FileUpload');
const  deleteFile  = require('../helpers/deleteFile');

const folderName = 'teachers';
const uploadMiddleware = upload(folderName);

class TeacherController {
      
    async getTeacher(req, res) {
        try {
            const teachers = await Teacher.find()
            .populate([
                {path: '_id', select: "auth name lastname about grade filial "}
            ])
            console.log(teachers);
            res.json(teachers);
        } catch (error) {
            console.log('Error fetching teachers:', error);
            res.status(500).send('Server Error');
        }
    }

    async createTeacher(req, res) {
        try {
        // const folderName = req.params.folderName;
            uploadMiddleware(req, res, async function (err) {
                if (err) {
                    return res.status(400).send({ message: err.message });
                }
                // res.send({ message: 'File uploaded successfully' });

                const { auth, name, lastname, about, grade, filial } = req.body;

                if (!auth || !name || !lastname || !grade || !filial) {
                    return res.status(400).json({ message: "Hamma maydon to'ldirilishi shart!" });
                }
                const checkTeacher = await Teacher.findOne({ auth });
                if (checkTeacher) {
                    return res.status(400).json({ message: "Bunday teacher mavjud" });
                }
                const photo = req.file ? req.file.path : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

                const newTeacher = new Teacher({ 
                    auth, name, lastname, grade, filial, about, photo 
                });
                
                const savedTeacher = await newTeacher.save();
                
                return res.status(201).json({savedTeacher});
                // res.json({ newTeacher, message: 'Teacher created successfully' });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    async updateTeacher(req, res) {
        try {
          uploadMiddleware(req, res, async function (err) {
              if (err) {
                  return res.status(400).send({ message: err.message });
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
                            deleteFile(filePath)
                    }
                }
    
                const updatedTeacher = await Teacher.findByIdAndUpdate(id, updatedFields, { new: true });
    
                res.json({ updatedTeacher, message: 'Teacher updated successfully' });
            });
            } catch (error) {
                console.log(error);
                res.status(500).send('Server Error');
            }
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
                // const filePath = path.join('uploads', folderName, teacher.photo);
                deleteFile(filePath)
            }
    
            await Teacher.findByIdAndDelete(id);
    
            res.json({ message: 'Teacher muvaffaqiyatli oʻchirildi' });
        } catch (error) {
            console.error('Error deleting teacher:', error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new TeacherController();
