const express = require('express');
const router = express.Router();
const settingController = require("../controllers/settingController");

router.get("/", settingController.GetSettings);
router.post("/", settingController.UpdateSetting);

module.exports = router;