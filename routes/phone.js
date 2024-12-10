const express = require('express');
const router = express.Router();
const phoneController = require("../controllers/phoneController");

router.post("/", phoneController.Process);

module.exports = router;