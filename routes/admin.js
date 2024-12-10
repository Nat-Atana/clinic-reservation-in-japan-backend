const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/user", adminController.GetAdminUsers);
router.post("/user", adminController.CreateAdminUser);
router.put("/user:id", adminController.UpdateAdminUser);
router.delete("/user:id", adminController.DeleteAdminUser);

router.get("/hospital", adminController.GetHospitals);
router.post("/hospital", adminController.CreateHospital);
router.put("/hospital:id", adminController.UpdateHospital);
router.delete("/hospital:id", adminController.DeleteHospital);

router.post("/login", adminController.Login);

module.exports = router;