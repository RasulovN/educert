const Auth = require('../models/Auth');
const Filial = require('../models/Filial');
const Group = require('../models/Group');
const Room = require('../models/Room');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const Time = require('../models/Time');
const User = require('../models/User');

class PostController {
    // Filial
    async getFiial (req, res) {
        try {
            const filial = await Filial.find();
    
            res.json(filial);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }  
    async createFilial (req, res) {
        try {
            const { title, address } = req.body;
    
            let existingFilial = await Filial.findOne({ address, title });
            if (existingFilial) {
                return res.status(400).json({ message: 'Bunday filial mavjud' });
            }
            if (!title || !address) {
                return res.status(400).json({ message: "Maydon bo'sh bo'lishi mumkin emas" });
            }
    
            const newFilial = new Filial({ title, address });
            await newFilial.save();
    
            res.json({ message: 'Filial muaffaqiyatli yaratildi' });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
}
    async deleteFiial (req, res) {
        const { id } = req.params;
        const filialId = req.params.id;

        try {
            // if (!id || id.length !== 24) {
            //     return res
            //     .status(404)
            //     .json(
            //         "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
            //     );
            // }
            await Filial.findByIdAndDelete(filialId);

            res.json({ message: 'Filial deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
    async updateFiial (req, res) {
        const filialId = req.params.id;
        const { title, address } = req.body;
        try {
            // if (!filialId || filialId.length !== 24 ) {
            //     return res
            //     .status(404)
            //     .json(
            //         "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
            //     );
            // }
            const updatedFilial = await Filial.findByIdAndUpdate(filialId, { title, address }, { new: true });
            if (!updatedFilial) {
                return res.status(404).json({ message: 'Filial not found' });
            }

            res.json(updatedFilial);
        } catch (error) {
            // console.log(error);
            res.status(500).send('Server Error');
        }
    }

// Room
    async getRooms (req, res) {
        try {
            const rooms = await Room.find().populate('filial', 'title address');
    
            res.json(rooms);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    async createRoom (req, res) {
        try {
            const { filial, number } = req.body;
    
            let checkNumber = await Room.findOne({ filial, number });
            if (checkNumber) {
                return res.status(400).json({ message: 'Bu filialda bunday xona mavjud' });
            }
    
            const newRoom = new Room({ filial, number });
            await newRoom.save();
    
            res.json({ message: 'Xona muvaffaqiyatli yaratildi' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
    async updateRoom (req, res) {
        try {
            const roomId = req.params.id;
            const { filial, number } = req.body;
            // if (!roomId || roomId.length !== 24 ) {
            //            return res.status(404).json("ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas")
            // }

            await Room.findByIdAndUpdate(roomId, { filial, number });
    
            res.json({ message: 'Xona muvaffaqiyatli yangilandi' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
    async deleteRoom (req, res) {
        try {
            const roomId = req.params.id;
            if (!roomId || roomId.length !== 24) {
                return res.status(404).json("ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas")
             }
            await Room.findByIdAndDelete(roomId);
    
            res.json({ message: 'Xona muvaffaqiyatli oʻchirildi' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    // Group
    async getGroup (req, res) {
     try {
            const groups = await Group.find().populate('filial', 'title subject');
            
            res.json(groups);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
    async createGroup (req, res) {
         try {
        const { teacher, title, subject, filial } = req.body;

        let existingGroup = await Group.findOne({ title, filial });
        if (existingGroup) {
            return res.status(400).json({ message: 'Guruh filialda allaqachon mavjud' });
        }

        const newGroup = new Group({ teacher, title, subject, filial });
        await newGroup.save();

        res.json({ message: 'Guruh muvaffaqiyatli yaratildi' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
    }
    async updateGroup (req, res) {
        try {
        const groupId = req.params.id;
        const { teacher, title, subject, filial } = req.body;

        if(!groupId){
            res.json("ID Yo'q") 
        }
        if(!req.body){
            res.json("Hamma maydon to'ldirilishi shart") 
        }
        await Group.findByIdAndUpdate(groupId, { teacher, title, subject, filial });

        res.json({ message: 'Guruh muvaffaqiyatli yangilandi' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
    }
    async deleteGroup (req, res) {
         try {
        const groupId = req.params.id;

        await Group.findByIdAndDelete(groupId);

        res.json({ message: 'Guruh muvaffaqiyatli oʻchirildi' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
    }

    //Subject
    async getSubject (req, res) {
       try {
           const subjects = await Subject.find().populate('filial', 'title subject');
   
           res.json(subjects);
       } catch (error) {
           console.error(error);
           res.status(500).send('Server Error');
       }
    }
     async createSubject (req, res) {
        try {
            const { title, filial, photo } = req.body;
    
            // let existingSubject = await Subject.findOne({ title, filial });
            // if (existingSubject) {
            //     return res.status(400).json({ message: 'Yunalish filialda allaqachon mavjud' });
            // }
    
            const newSubject = new Subject({ title, filial, photo });
            await newSubject.save();
    
            res.json({ message: 'Mavzu muvaffaqiyatli yaratildi' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
     }
     async updateSubject (req, res) {
        try {
            const subjectId = req.params.id;
            const { title, filial, photo } = req.body;
    //         if (!subjectId || subjectId.length !== 24 ) {
    //             return res.status(404).json("ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas")
    //  }

            if(!title || !filial || !photo){
                res.status(400).json(`Hamma maydon to'ldirilishi shart`)
            }
            await Subject.findByIdAndUpdate(subjectId, { title, filial, photo });
    
            res.json({ message: 'Mavzu muvaffaqiyatli yangilandi' });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
     }
     async deleteSubject (req, res) {
        try {
            const subjectId = req.params.id;
            if (!subjectId || subjectId.length !== 24) {
                return res.status(404).json("ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas")
     }
            await Subject.findByIdAndDelete(subjectId);
    
            res.json({ message: 'Mavzu muvaffaqiyatli oʻchirildi' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
     }

    //  User
     async getUser (req, res) {
        try {
            const users = await User.find();
            res.json(users);
          } catch (err) {
            res.status(500).json({ message: err.message });
          }
     }
     async createUser(req, res) {
        try {
            const { auth, name, lastname, photo, filial } = req.body;
            const checkUser = await User.findOne({auth})
            if (checkUser) {
                    return res.status(400).json({ message: "Bunday Auth li User mavjud" });
                }
        
            const newUser = new User({
                auth,
                name,
                lastname,
                photo,
                filial
            });
    
            await newUser.save();
    
            res.json({ message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi" });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
    
     async updateUser (req, res) {
        try {
            const { id } = req.params;
    //         if (!id || id.length !== 24 ) {
    //             return res.status(404).json("ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas")
    //  }
            const user = await User.findByIdAndUpdate(id, req.body, { new: true });
            res.json({user,  message: 'Foydalanuvchi muvaffaqiyatli yangilandi' });
        } catch (error) {
            res.status(500).send('Server Error');
        }
     }
     async deleteUser (req, res) {
        try {
            const { id } = req.params;
            // if (!id || id.length !== 24 ) {
            //     return res.status(404).json("ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas")
            // }
            await User.findByIdAndDelete(id);
            res.json({ message: 'Foydalanuvchi muvaffaqiyatli oʻchirildi' });
        } catch (error) {
            res.status(500).send('Server Error');
        }
     }

    //  Teacher
     async getTeacher (req, res) {
        try {
            const teachers = await Teacher.find().populate('auth').populate('filial');
            console.log('Teachers:', teachers);
            res.json(teachers);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
     }
     async createTeacher (req, res) {
        try {
            const { auth, name, lastname, photo, grade, filial } = req.body;
    
            if (!auth || !name || !lastname || !photo || !grade || !filial) {
                return res.status(400).json({ message: "Hamma maydonllar to'ldirilishi shart" });
            }
            const checkTeacher = await Teacher.findOne({auth})
            if (checkTeacher) {
                    return res.status(400).json({ message: "Bunday Auth li teacher mavjud" });
                }
        
            // const checkAuth = await Auth.find({auth})
            // if (checkAuth) {
            //     return res.status(400).json({ message: "Bir xil auth bilan teacher qo'shish mumkin emas" });
            // }
    
            const newTeacher = new Teacher({ auth, name, lastname, photo, grade, filial });
            await newTeacher.save();
            res.json(newTeacher);
        } catch (error) {
            res.status(500).send('Server Error');
        }
     }
     async updateTeacher (req, res) {
        try {
            const { id } = req.params;
            const { auth, name, lastname, photo, grade, filial } = req.body;
    
            if (!auth || !name || !lastname || !photo || !grade || !filial) {
                return res.status(400).json({ message: "Hamma maydonllar to'ldirilishi shart" });
            }
            const updatedTeacher = await Teacher.findByIdAndUpdate(id, { auth, name, lastname, photo, grade, filial }, { new: true });
            res.json({updatedTeacher, message: 'Teacher muvaffaqiyatli yangilandi' });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
     }
     async deleteTeacher (req, res) {
        try {
            const { id } = req.params;
            await Teacher.findByIdAndDelete(id);
            res.json({ message: 'Foydalanuvchi muvaffaqiyatli oʻchirildi' });
        } catch (error) {
            res.status(500).send('Server Error');
        }
     }
    //  Student
     async getStudent (req, res) {
        try {
            const students = await Student.find().populate('auth').populate('filial');
            return res.status(200).json(students);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
     }
     async createStudent (req, res) {
        try {
            const { auth, name, lastname, filial, subjects, groups } = req.body;
    
            let existingStudent = await Student.findOne({ auth });
            if (existingStudent) {
                return res.status(400).json({ message: 'Bunday talaba allaqachon mavjud' });
            }
    
            if (!req.body) {
                return res.status(400).json({ message: "Hamma maydon to'ldirilishi shart" });
            }
    
            const newStudent = new Student({ auth, name, lastname, filial, subjects, groups });
    
            await newStudent.save();
    
            res.json({ message: "Student muaffaqiyatli qo'shildi" });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
     }
     async updateStudent (req, res) {
        try {
            const studentId = req.params.id;
            const { name, lastname, filial, subjects, groups } = req.body;
    
            await Student.findByIdAndUpdate(studentId, { name, lastname, filial, subjects, groups });
    
            res.json({ message: "Student muaffaqiyatli yangilandi" });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
     }
     async deleteStudent (req, res) {
        try {
            const studentId = req.params.id;
    
            // Find the student by ID and delete
            await Student.findByIdAndDelete(studentId);
    
            res.json({ message: "Student muaffaqiyatli o'chirildi" });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
     }
    //  Time
     async getTime (req, res) {
        try {
            const time = await Time.find().populate('filial'); // Populate 'filial' to get details from the 'Filial' collection
            res.json(time);
        } catch (error) {
           console.log(error);
        }
     }
     async createTime (req, res) {
        try {
            const { filial, start, end  } = req.body;
            const newTime = new Time({
                filial: filial,
                start: start,
                end: end
            });
            const savedTime = await newTime.save();
            res.json({ savedTime, message: 'Vaqt muvaffaqiyatli yaratildi' });
        } catch (error) {
           console.log(error);
        }
     }
     async updateTime (req, res) {
        try {
            const timeId = req.params.id;
            const { filial, start, end  } = req.body;
           const updateTime = await Time.findByIdAndUpdate(timeId, { start, end, filial });
    
            res.json({ updateTime, message: 'Vaqt muvaffaqiyatli yangilandi' });
        } catch (error) {
           console.log(error);
        }
     }
     async deleteTime (req, res) {
        try {
            const timeId = req.params.id;
             await Time.findByIdAndDelete(timeId);
    
            res.json({ message: "Vaqt muvaffaqiyatli yangilandi o'chirildi" });;
        } catch (error) {
           console.log(error);
        }
     }
}

module.exports = new PostController();