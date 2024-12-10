const express = require('express');
const router = express.Router();
const reservationController = require("../controllers/reservationController");

router.get("/", reservationController.GetReservations);
router.get("/frame", reservationController.GetReservationsByFrame);
router.get("/frames", reservationController.GetFrames);
router.post("/", reservationController.CreateReservation);
router.put("/:id", reservationController.UpdateReservation);
router.delete("/:id", reservationController.DeleteReservation);

module.exports = router;