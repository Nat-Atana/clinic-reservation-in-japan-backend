const express = require('express');
const router = express.Router();
const doctorController = require("../controllers/doctorController");

router.get("/", doctorController.GetDoctors);
router.post("/", doctorController.CreateDoctor);
router.put("/:id", doctorController.UpdateDoctor);
router.delete("/:id", doctorController.DeleteDoctor);

module.exports = router;