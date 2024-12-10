const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const breakdayRoutes = require("./breakday");
const clinicRoutes = require('./clinic');
const doctorRoutes = require('./doctor');
const roomRoutes = require("./room");
const frameRoutes = require("./frame");
const reservationRoutes = require("./reservation");
const notificationRoutes = require("./notification");
const userRoutes = require("./user");
const settingRoutes = require("./setting");

const clientRoutes = require("./client");
const adminRoutes = require("./admin");
const phoneRoutes = require("./phone");

router.use('/auth', authRoutes);
router.use('/breakdays', breakdayRoutes);
router.use('/clinics', clinicRoutes);
router.use('/doctors', doctorRoutes);
router.use('/rooms', roomRoutes);
router.use('/frames', frameRoutes);
router.use('/reservations', reservationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);
router.use('/setting', settingRoutes);
router.use('/setting', settingRoutes);

router.use('/client', clientRoutes);
router.use('/admin', adminRoutes);
router.use('/phone', phoneRoutes);

module.exports = router;