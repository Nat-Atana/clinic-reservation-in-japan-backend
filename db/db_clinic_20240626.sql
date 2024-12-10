-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: localhost    Database: db_clinic
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.22.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `breakdays`
--

DROP TABLE IF EXISTS `breakdays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `breakdays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `breakdays`
--

LOCK TABLES `breakdays` WRITE;
/*!40000 ALTER TABLE `breakdays` DISABLE KEYS */;
INSERT INTO `breakdays` VALUES (28,'crismas','2024-05-19','2024-05-19 12:40:21','2024-05-19 12:40:21',0),(29,'good','2024-06-03','2024-06-03 09:45:50','2024-06-03 09:45:50',0),(30,'bad','2024-06-03','2024-06-03 09:46:12','2024-06-03 09:46:12',0),(31,'元日','2024-01-01','2024-06-05 11:20:29','2024-06-05 11:20:29',1),(32,'成人の日','2024-01-08','2024-06-05 11:20:43','2024-06-05 11:20:43',1),(33,'春分の日','2024-03-20','2024-06-05 11:21:06','2024-06-05 11:21:06',1),(34,'good','2024-06-19','2024-06-19 08:22:49','2024-06-19 08:22:49',0);
/*!40000 ALTER TABLE `breakdays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinics`
--

DROP TABLE IF EXISTS `clinics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `webURL` varchar(255) NOT NULL,
  `reserveDate` int NOT NULL,
  `questionDate` int NOT NULL,
  `isNoti` tinyint(1) NOT NULL,
  `webInterview1` int NOT NULL,
  `webInterview2` int NOT NULL,
  `exam1` int NOT NULL,
  `exam2` int NOT NULL,
  `sort` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinics`
--

LOCK TABLES `clinics` WRITE;
/*!40000 ALTER TABLE `clinics` DISABLE KEYS */;
INSERT INTO `clinics` VALUES (5,'診療科1','test1',2,5,1,1,0,0,0,'5','2024-06-05 09:49:47','2024-06-23 23:55:01',1),(7,'診療科2','test2',0,0,0,0,0,0,0,'1','2024-06-05 11:25:10','2024-06-23 23:54:18',1),(8,'内科','',6,1,1,0,0,1,0,'4','2024-06-21 00:04:05','2024-06-23 23:55:11',1),(9,'産婦人科','?options=61991',60,2,1,0,0,0,0,'3','2024-06-21 00:07:12','2024-06-23 23:54:43',1),(10,'泌尿器科（フルカスタマイズ用）','?options=96544&mnsn=102428 ',6,2,1,0,0,0,0,'2','2024-06-21 00:09:26','2024-06-23 23:54:49',1);
/*!40000 ALTER TABLE `clinics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clinic` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `furigana` varchar(255) NOT NULL,
  `sort` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (3,4,'Hamada','hello','0','2024-05-19 22:11:59','2024-05-19 22:11:59',0),(4,5,'陽葵','','name','2024-06-05 11:24:02','2024-06-05 11:24:02',1),(5,8,'内科＿田中','たなか','name','2024-06-19 08:25:20','2024-06-21 00:10:15',1),(6,8,'内科＿佐藤','さとう','','2024-06-19 08:26:00','2024-06-21 00:10:25',1),(7,9,'産婦人科_高瀬','たかせ','','2024-06-21 00:10:50','2024-06-21 00:10:50',1),(8,10,'泌尿器科_長谷川','はせがわ','','2024-06-21 00:11:11','2024-06-21 00:11:11',1);
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frames`
--

DROP TABLE IF EXISTS `frames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `frames` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room` bigint NOT NULL,
  `doctor` bigint NOT NULL,
  `clinic` bigint NOT NULL,
  `date` varchar(10) NOT NULL,
  `fromTime` time NOT NULL,
  `toTime` time NOT NULL,
  `availableReserve` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frames`
--

LOCK TABLES `frames` WRITE;
/*!40000 ALTER TABLE `frames` DISABLE KEYS */;
INSERT INTO `frames` VALUES (35,4,3,4,'2024-05-14','05:18:00','04:18:00',3,'2024-05-19 23:18:58','2024-05-19 23:18:58',0),(36,4,3,4,'2024-05-21','02:24:00','05:25:00',2,'2024-05-19 23:24:36','2024-05-19 20:28:28',1),(37,4,3,4,'2024-05-22','02:24:00','05:25:00',2,'2024-05-19 23:32:30','2024-05-19 23:32:30',1),(38,4,3,4,'2024-05-23','02:24:00','05:25:00',2,'2024-05-19 23:32:30','2024-05-19 23:32:30',1),(39,4,3,4,'2024-05-24','02:24:00','05:25:00',2,'2024-05-19 23:32:30','2024-05-19 23:32:30',1),(40,6,5,5,'2024-06-21','09:00:00','09:30:00',3,'2024-06-21 00:27:54','2024-06-21 00:27:54',1),(41,6,5,5,'Thu Jun 20','09:00:00','09:30:00',3,'2024-06-21 02:14:22','2024-06-21 02:14:22',1),(42,6,5,5,'Fri Jun 21','09:00:00','09:30:00',3,'2024-06-21 02:14:22','2024-06-21 02:14:22',1),(43,6,5,5,'Thu Jun 27','09:00:00','09:30:00',3,'2024-06-21 02:14:22','2024-06-21 02:14:22',1),(44,6,5,5,'Fri Jun 28','09:00:00','09:30:00',3,'2024-06-21 02:14:22','2024-06-21 02:14:22',1),(45,6,5,5,'Wed Jun 26','09:00:00','09:30:00',3,'2024-06-21 02:14:22','2024-06-21 02:14:22',1),(46,6,5,5,'Tue Jun 25','09:00:00','09:30:00',3,'2024-06-21 02:14:22','2024-06-21 02:14:22',1),(47,6,5,5,'Mon Jun 24','09:00:00','09:30:00',3,'2024-06-21 02:14:22','2024-06-21 02:14:22',1);
/*!40000 ALTER TABLE `frames` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patientEmail` varchar(255) NOT NULL,
  `isNoti` tinyint(1) NOT NULL,
  `webInterview1` int NOT NULL,
  `webInterview2` int NOT NULL,
  `exam1` int NOT NULL,
  `exam2` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (2,'hamada',1,2,3,3,2,'2024-05-19 23:53:43','2024-05-19 23:53:43',0);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patientName` varchar(255) NOT NULL,
  `patientFurigana` varchar(255) NOT NULL,
  `patientGender` varchar(255) NOT NULL,
  `patientDOB` date NOT NULL,
  `patientPhone` varchar(255) NOT NULL,
  `patientEmail` varchar(255) NOT NULL,
  `patientZipCode` varchar(255) NOT NULL,
  `patientAddress` varchar(255) NOT NULL,
  `patientNote` text NOT NULL,
  `frame` varchar(255) NOT NULL,
  `webURL` varchar(255) NOT NULL,
  `webInterviewStatus` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (2,'Hamada','adb','Man','2024-05-08','3344580355','liu.fung.940616@gmail.com','79603','Maven 0738','sdfsdfsdf','0','','Success','2024-05-19 23:43:02','2024-05-19 20:43:02',0);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clinic` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sort` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (4,'4','Room1','0','2024-05-20 08:05:50','2024-05-20 08:05:50',0),(5,'5','診察室1-1','clinic','2024-06-05 18:48:27','2024-06-13 09:48:04',1),(6,'8','内科①','clinic','2024-06-05 20:25:31','2024-06-21 09:11:35',1),(7,'5','診察室1-2','','2024-06-19 17:26:31','2024-06-19 17:26:31',1),(8,'8','内科②','','2024-06-21 09:11:49','2024-06-21 09:11:49',1),(9,'9','産婦人科①','','2024-06-21 09:12:20','2024-06-21 09:12:20',1),(10,'10','泌尿器①','','2024-06-21 09:15:01','2024-06-21 09:15:01',1);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `field` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'clinic','内科クリニック','2024-05-19 21:17:41'),(2,'reservationDescription','医療×WEB” 業界を専門としてきたgritsだからこそ、WEBマーケティングにて人々のメディカルIQの向上に寄与し治療の選択肢を増やせる世の中を実現させます。\n\n活動を行うにあたり、約20年程「医療×WEB」に特化した専門のディレクターがMedical grits事業を推進していき、先生方と共に「Medical grits Service」で人々のQOLを高めていけるように邁進していきます。','2024-05-19 21:17:58'),(3,'privacy','','2024-05-19 21:18:13'),(4,'clientName','1','2024-05-19 21:18:28'),(5,'clientFurigana','1','2024-05-19 21:18:45'),(6,'clientGender','1','2024-05-19 21:18:58'),(7,'clientDOB','1','2024-05-19 21:19:13'),(8,'reservationNum','1','2024-05-19 21:19:25'),(9,'phone','0','2024-05-19 21:19:35'),(10,'email','0','2024-05-19 21:19:47'),(11,'zipCode','0','2024-05-19 21:19:57'),(12,'address','0','2024-05-19 21:20:13'),(13,'additionalInfo','0','2024-05-19 21:20:24'),(14,'webBaseURL','test','2024-05-19 21:20:38'),(15,'mailingScheduleDate','2','2024-05-19 21:20:48'),(16,'mailingTime','2','2024-05-19 21:21:01'),(17,'mailingDate','2024-05-15','2024-05-19 21:21:13'),(18,'dispClientName','','2024-05-19 21:21:31'),(19,'dispClientDOB','','2024-05-19 21:21:43'),(20,'dispClientURL','','2024-05-19 21:21:50');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'test@gmail.com','hamada','$2a$10$e2j3YLx.GAqPIONwHhriOe/UhGqB3EpTRREPFYDEwMTUDctRqpIgG','','2024-05-19 09:51:24','2024-05-19 09:51:24',1),(12,'yoshida@gmail.com','yoshida','$2a$10$9yekfiGIwysFB/mVNrk6l.t3uqDKiDDl22L1k866nHWN7Q7peUE7K','staff','2024-05-19 13:09:11','2024-06-05 14:50:59',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-24  9:06:35
