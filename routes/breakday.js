const express = require('express');
const router = express.Router();
const breakdayController = require("../controllers/breakdayController");

router.get("/", breakdayController.GetBreakdays);
router.post("/", breakdayController.CreateBreakday);
router.put("/:id", breakdayController.UpdateBreakday);
router.delete("/:id", breakdayController.DeleteBreakday);

module.exports = router;