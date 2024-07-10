const Room = require('../models/Room');


class RoomController {
    
// Room
async getRooms (req, res) {
    try {
        const rooms = await Room.find()
        .populate([
            {path: '_id', select: "filial number "}
        ]);
        return res.status(200).json(rooms);
    } catch (error) {
        console.log(error);
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
        console.log(error);
        res.status(500).send('Server Error');
    }
}
async updateRoom (req, res) {
    try {
        const roomId = req.params.id;
        const { filial, number } = req.body;
        let checkNumber = await Room.findOne({ filial, number });
        if (checkNumber) {
            return res.status(400).json({ message: 'Bu filialda bunday xona mavjud' });
        }
        const updatedRoom = await Room.findByIdAndUpdate(roomId, { filial, number });
        updatedRoom = await updatedRoom.populate('filial')
        res.json({ message: 'Xona muvaffaqiyatli yangilandi' });
    } catch (error) {
        console.log(error);
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
        console.log(error);
        res.status(500).send('Server Error');
    }
}

    
}
module.exports = new RoomController();