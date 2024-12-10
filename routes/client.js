const express = require('express');
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/setting", clientController.GetSetting);
router.get("/clinic", clientController.GetClinics);
router.get("/reservations", clientController.GetReservations);
router.get("/frames", clientController.GetReservationsByDate);
router.get('/frameById', clientController.GetFrame);
router.post('/reserve', clientController.Reserve);
router.post('/reserve_finish', clientController.ReserveFinish);

module.exports = router;