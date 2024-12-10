const express = require('express');
const router = express.Router();
const clinicController = require("../controllers/clinicController");

router.get("/", clinicController.GetClinics);
router.post("/", clinicController.CreateClinic);
router.put("/:id", clinicController.UpdateClinic);
router.delete("/:id", clinicController.DeleteClinic);

module.exports = router;