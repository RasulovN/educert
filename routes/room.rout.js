const {Router} = require('express')
const router = Router()
const RoomController = require('../controllers/room.controller');

// Room
router.get('/', RoomController.getRooms)
        .post('/add', RoomController.createRoom)
        .put('/update/:id', RoomController.updateRoom)
        .delete('/delete/:id', RoomController.deleteRoom);

module.exports = router;
