const express = require('express');
const router = express.Router();
const atanaController = require("../controllers/atanaController.js");

router.get("/atana", atanaController.GetAtanas);

module.exports = router;