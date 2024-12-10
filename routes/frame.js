const express = require('express');
const router = express.Router();
const frameController = require("../controllers/frameController");

router.get("/", frameController.GetFrames);
router.get("/room", frameController.GetFramesByRoom);
router.post("/", frameController.CreateFrame);
router.put("/:id", frameController.UpdateFrame);
router.delete("/:id", frameController.DeleteFrame);
router.post("/copy", frameController.CopyFrame);

module.exports = router;