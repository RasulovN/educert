const Time = require('../models/Time');


class TimeController {
     //  Time
     async getTime (req, res) {
        try {
            const time = await Time.find()
            .populate([
               {path: '_id', select: "filial start end"}
           ]) 
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


module.exports = new TimeController();