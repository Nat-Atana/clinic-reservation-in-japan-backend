const express = require('express');
const router = express.Router();
const roomController = require("../controllers/roomController");

router.get("/", roomController.GetRooms);
router.get("/clinic", roomController.GetRoomsByClinic);
router.post("/", roomController.CreateRoom);
router.put("/:id", roomController.UpdateRoom);
router.delete("/:id", roomController.DeleteRoom);

module.exports = router;