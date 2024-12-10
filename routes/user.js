const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.GetUsers);
router.post("/", userController.CreateUser);
router.put("/:id", userController.UpdateUser);
router.put("/menu/:id", userController.UpdateMenu);
router.delete("/:id", userController.DeleteUser);

module.exports = router;