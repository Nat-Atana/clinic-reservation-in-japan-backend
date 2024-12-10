const express = require('express');
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/", notificationController.GetNotifications);
router.post("/", notificationController.CreateNotification);
router.put("/:id", notificationController.UpdateNotification);
router.delete("/:id", notificationController.DeleteNotification);

module.exports = router;