const Group = require('../models/Group');


class GroupController {
     // Group
     async getGroup (req, res) {
        try {
               const groups = await Group.find().populate('filial', 'title subject');
               
               res.json(groups);
           } catch (error) {
               console.log(error);
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
           console.log(error);
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
           console.log(error);
           res.status(500).send('Server Error');
       }
       }
       async deleteGroup (req, res) {
            try {
           const groupId = req.params.id;
   
           await Group.findByIdAndDelete(groupId);
   
           res.json({ message: 'Guruh muvaffaqiyatli oʻchirildi' });
       } catch (error) {
           console.log(error);
           res.status(500).send('Server Error');
       }
       }
}

    module.exports = new GroupController();