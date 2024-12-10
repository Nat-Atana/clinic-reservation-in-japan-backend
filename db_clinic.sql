DROP TABLE IF EXISTS `breakdays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `breakdays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` varchar(10) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `clinics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `webURL` varchar(255) NOT NULL,
  `reserveDate` int(11) NOT NULL,
  `questionDate` int(11) NOT NULL,
  `isNoti` tinyint(1) NOT NULL,
  `webInterview1` int(11) NOT NULL,
  `webInterview2` int(11) NOT NULL,
  `exam1` int(11) NOT NULL,
  `exam2` int(11) NOT NULL,
  `sort` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clinic` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `furigana` varchar(255) NOT NULL,
  `sex` varchar(4) NOT NULL,
  `sort` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `frames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `frames` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room` bigint(20) NOT NULL,
  `doctor` bigint(20) NOT NULL,
  `clinic` bigint(20) NOT NULL,
  `date` varchar(10) NOT NULL,
  `fromTime` time NOT NULL,
  `toTime` time NOT NULL,
  `availableReserve` int(11) NOT NULL,
  `remainReserve` int(11) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patientEmail` varchar(255) NOT NULL,
  `isNoti` tinyint(1) NOT NULL,
  `webInterview1` int(11) NOT NULL,
  `webInterview2` int(11) NOT NULL,
  `exam1` int(11) NOT NULL,
  `exam2` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patientName` varchar(255) NOT NULL,
  `patientFurigana` varchar(255) NOT NULL,
  `patientGender` varchar(255) NOT NULL,
  `patientDOB` date NOT NULL,
  `patientPhone` varchar(255) NOT NULL,
  `patientEmail` varchar(255) NOT NULL,
  `patientZipCode` varchar(255) NOT NULL,
  `patientAddress` varchar(255) NOT NULL,
  `patientNote` text NOT NULL,
  `medicalNum` varchar(20) NOT NULL,
  `frame` varchar(255) NOT NULL,
  `webURL` text NOT NULL,
  `webInterviewStatus` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clinic` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sort` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `field` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'clinic','内科クリニック','2024-05-19 21:17:41'),(2,'reservationDescription','医療×WEB” 業界を専門としてきたgritsだからこそ、WEBマーケティングにて人々のメディカルIQの向上に寄与し治療の選択肢を増やせる世の中を実現させます。\n\n活動を行うにあたり、約20年程「医療×WEB」に特化した専門のディレクターがMedical grits事業を推進していき、先生方と共に「Medical grits Service」で人々のQOLを高めていけるように邁進していきます。','2024-05-19 21:17:58'),(3,'privacy','','2024-05-19 21:18:13'),(4,'clientName','1','2024-05-19 21:18:28'),(5,'clientFurigana','1','2024-05-19 21:18:45'),(6,'clientGender','1','2024-05-19 21:18:58'),(7,'clientDOB','1','2024-05-19 21:19:13'),(8,'reservationNum','1','2024-05-19 21:19:25'),(9,'phone','0','2024-05-19 21:19:35'),(10,'email','0','2024-05-19 21:19:47'),(11,'zipCode','0','2024-05-19 21:19:57'),(12,'address','0','2024-05-19 21:20:13'),(13,'additionalInfo','0','2024-05-19 21:20:24'),(14,'webBaseURL','test','2024-05-19 21:20:38'),(15,'mailingScheduleDate','2','2024-05-19 21:20:48'),(16,'mailingTime','2','2024-05-19 21:21:01'),(17,'mailingDate','2024-05-15','2024-05-19 21:21:13'),(18,'dispClientName','','2024-05-19 21:21:31'),(19,'dispClientDOB','','2024-05-19 21:21:43'),(20,'dispClientURL','','2024-05-19 21:21:50'),(21,'mailContent','','2024-07-31 21:21:50'),(22,'clinicMailContent','','2024-08-21 21:21:50');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `menu` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test@gmail.com','浜田','$2a$10$e2j3YLx.GAqPIONwHhriOe/UhGqB3EpTRREPFYDEwMTUDctRqpIgG','admin','2024-05-19 09:51:24','2024-05-19 09:51:24',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;