const Auth = require('../models/Auth');
const Student = require('../models/Student');


class StudentController {
      //  Student
      async getStudent (req, res) {
        try {
            const students = await Student.find();
            return res.status(200).json(students);
        } catch (error) {
            console.log('Error fetching students:', error);
        }
     }
     async createStudent (req, res) {
        try {
            const { auth, name, lastname, filial, subjects, groups } = req.body;
    console.log(subjects);
            let existingStudent = await Student.findOne({ auth });
            if (existingStudent) {
                return res.status(400).json({ message: 'Bunday auth li talaba allaqachon mavjud' });
            }
    
            if (!req.body) {
                return res.status(400).json({ message: "Hamma maydon to'ldirilishi shart" });
            }
    
            const newStudent = new Student({ auth, name, lastname, filial, subjects, groups });
    
            await newStudent.save();
            res.json({ message: "Student muaffaqiyatli qo'shildi" });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
     }
     async updateStudent (req, res) {
        try {
            const studentId = req.params.id;
            const { auth, name, lastname, filial, subjects, groups } = req.body;
            // let existingStudent = await Auth.findOne({ auth });
            // if (!existingStudent) {
            //     return res.status(400).json({ message: 'Bunday auth mavjud emas' });
            // }
            const updatedStudent = await Student.findByIdAndUpdate(studentId, { auth, name, lastname, filial, subjects, groups });
    
            res.json({updatedStudent,  message: "Student muaffaqiyatli yangilandi" });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
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