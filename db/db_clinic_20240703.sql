/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.18-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: db_clinic
-- ------------------------------------------------------
-- Server version	10.6.18-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `breakdays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` varchar(10) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `breakdays`
--

LOCK TABLES `breakdays` WRITE;
/*!40000 ALTER TABLE `breakdays` DISABLE KEYS */;
INSERT INTO `breakdays` VALUES (28,'crismas','2024-05-19','2024-05-19 12:40:21','2024-05-19 12:40:21',0),(29,'good','2024-06-03','2024-06-03 09:45:50','2024-06-03 09:45:50',0),(30,'bad','2024-06-03','2024-06-03 09:46:12','2024-06-03 09:46:12',0),(31,'元日','2024-01-01','2024-06-05 11:20:29','2024-06-05 11:20:29',1),(32,'成人の日','2024-01-08','2024-06-05 11:20:43','2024-06-05 11:20:43',1),(33,'春分の日','2024-03-23','2024-06-05 11:21:06','2024-06-27 07:21:36',1),(34,'good','2024-06-19','2024-06-19 08:22:49','2024-06-19 08:22:49',0),(35,'試しの祝日7/1','2024-07-01','2024-06-27 02:59:33','2024-06-27 07:09:43',0),(36,'試し7/1祝日','2024-07-01','2024-06-27 07:10:27','2024-06-27 07:10:27',0),(37,'０６２８','2024-06-28','2024-06-27 07:18:52','2024-06-27 07:19:33',0),(38,'テスト８．１','2024-08-01','2024-06-27 07:23:03','2024-06-27 07:23:03',0),(39,'8/2で登録','2024-08-02','2024-06-27 07:25:33','2024-06-27 07:25:33',1),(40,'１０・１を休み','2024-10-02','2024-06-27 08:32:29','2024-06-27 08:32:29',1);
/*!40000 ALTER TABLE `breakdays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinics`
--

DROP TABLE IF EXISTS `clinics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinics`
--

LOCK TABLES `clinics` WRITE;
/*!40000 ALTER TABLE `clinics` DISABLE KEYS */;
INSERT INTO `clinics` VALUES (5,'診療科1','test1',2,5,1,1,0,0,0,'5','2024-06-05 09:49:47','2024-06-23 23:55:01',1),(7,'診療科2','test2',0,0,0,0,0,0,0,'1','2024-06-05 11:25:10','2024-06-23 23:54:18',1),(8,'内科','',6,1,1,0,0,1,0,'4','2024-06-21 00:04:05','2024-07-03 00:15:19',1),(9,'産婦人科','?options=61991',60,2,1,0,0,0,0,'3','2024-06-21 00:07:12','2024-06-23 23:54:43',1),(10,'泌尿器科（フルカスタマイズ用）','?options=96544&mnsn=102428 ',6,2,1,0,0,0,0,'2','2024-06-21 00:09:26','2024-06-23 23:54:49',1),(11,'消化器内科','',0,0,0,0,0,0,0,'1','2024-07-02 06:18:44','2024-07-02 06:18:44',1),(12,'循環器内科','',0,0,0,0,0,0,0,'1','2024-07-02 06:19:00','2024-07-02 06:19:00',1),(13,'腎臓内科','',0,0,0,0,0,0,0,'1','2024-07-02 06:19:16','2024-07-02 06:19:16',1),(14,'糖尿病内科','',0,0,0,0,0,0,0,'1','2024-07-02 06:19:24','2024-07-02 06:19:24',1),(15,'外科','',0,0,0,0,0,0,0,'1','2024-07-02 06:19:35','2024-07-02 06:19:35',1),(16,'整形外科','',0,0,0,0,0,0,0,'1','2024-07-02 06:19:43','2024-07-02 06:19:43',1),(17,'耳鼻咽喉科','',0,0,0,0,0,0,0,'1','2024-07-02 06:20:04','2024-07-02 06:20:04',1),(18,'眼科','',0,0,0,0,0,0,0,'1','2024-07-02 06:20:12','2024-07-02 06:20:12',1),(19,'小児科','',0,0,0,0,0,0,0,'1','2024-07-02 06:20:48','2024-07-02 06:20:48',1),(20,'小児外科','',0,0,0,0,0,0,0,'1','2024-07-02 06:20:57','2024-07-02 06:20:57',1),(21,'リウマチ科','',0,0,0,0,0,0,0,'1','2024-07-02 06:21:08','2024-07-02 06:21:08',1);
/*!40000 ALTER TABLE `clinics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clinic` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `furigana` varchar(255) NOT NULL,
  `sort` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
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
/*!40101 SET character_set_client = utf8 */;
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
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frames`
--

LOCK TABLES `frames` WRITE;
/*!40000 ALTER TABLE `frames` DISABLE KEYS */;
INSERT INTO `frames` VALUES (35,4,3,4,'2024-05-14','05:18:00','04:18:00',3,3,'2024-05-19 23:18:58','2024-05-19 23:18:58',0),(36,5,4,5,'2024-05-21','02:24:00','05:25:00',2,2,'2024-05-19 23:24:36','2024-06-30 22:56:05',1),(37,5,4,5,'2024-05-22','02:24:00','05:25:00',2,2,'2024-05-19 23:32:30','2024-06-30 22:56:00',1),(38,5,4,5,'2024-05-23','02:24:00','05:25:00',2,2,'2024-05-19 23:32:30','2024-06-30 22:55:55',1),(39,5,4,5,'2024-05-24','02:24:00','05:25:00',2,2,'2024-05-19 23:32:30','2024-06-30 22:55:39',1),(40,6,5,8,'2024-06-21','09:00:00','09:30:00',3,3,'2024-06-21 00:27:54','2024-06-30 22:47:46',1),(54,7,4,5,'2024-06-22','09:00:00','12:00:00',3,3,'2024-06-24 00:28:11','2024-06-30 22:51:25',1),(55,7,4,5,'2024-06-24','09:00:00','12:00:00',3,3,'2024-06-24 00:34:51','2024-06-30 23:09:14',1),(56,7,4,5,'2024-06-25','09:00:00','12:00:00',3,3,'2024-06-24 00:34:51','2024-06-30 23:09:21',1),(57,7,4,5,'2024-06-27','09:00:00','12:00:00',3,3,'2024-06-24 00:34:51','2024-06-30 22:55:11',1),(58,7,4,5,'2024-06-28','09:00:00','12:00:00',3,3,'2024-06-24 00:34:51','2024-06-30 23:09:35',1),(59,6,5,5,'2024-06-24','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(60,6,5,5,'2024-07-08','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(61,6,5,5,'2024-07-09','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(62,6,5,5,'2024-07-10','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(63,6,5,5,'2024-06-25','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 11:28:49',0),(64,6,5,5,'2024-06-26','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(65,6,5,5,'2024-06-27','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(66,6,5,5,'2024-06-28','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(67,6,5,5,'2024-07-01','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(68,6,5,5,'2024-07-02','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(69,6,5,5,'2024-07-03','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(70,6,5,8,'2024-07-04','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:09:52',1),(71,6,5,8,'2024-07-05','09:00:00','09:30:00',3,2,'2024-06-27 02:19:30','2024-07-03 00:10:54',1),(72,6,5,8,'2024-07-11','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:09:57',1),(73,6,5,8,'2024-07-12','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:00',1),(74,6,5,8,'2024-07-15','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:02',1),(75,6,5,8,'2024-07-16','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:06',1),(76,6,5,8,'2024-07-17','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:08',1),(77,6,5,8,'2024-07-18','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:11',1),(78,6,5,8,'2024-07-19','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:13',1),(79,6,5,8,'2024-07-22','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:15',1),(80,6,5,8,'2024-07-23','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:19',1),(81,6,5,8,'2024-07-24','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:20',1),(82,6,5,8,'2024-07-25','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:25',1),(83,6,5,8,'2024-07-26','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:27',1),(84,6,5,8,'2024-07-29','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:31',1),(85,6,5,8,'2024-07-30','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:49',1),(86,6,5,8,'2024-07-31','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-30 23:10:40',1),(87,6,5,5,'2024-08-01','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(88,6,5,5,'2024-08-02','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(89,6,5,5,'2024-08-05','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(90,6,5,5,'2024-08-06','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(91,6,5,5,'2024-08-07','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(92,6,5,5,'2024-08-08','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(93,6,5,5,'2024-08-09','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(94,6,5,5,'2024-08-12','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(95,6,5,5,'2024-08-13','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(96,6,5,5,'2024-08-14','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(97,6,5,5,'2024-08-15','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(98,6,5,5,'2024-08-16','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(99,6,5,5,'2024-08-19','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(100,6,5,5,'2024-08-20','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(101,6,5,5,'2024-08-21','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(102,6,5,5,'2024-08-22','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(103,6,5,5,'2024-08-23','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(104,6,5,5,'2024-08-26','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(105,6,5,5,'2024-08-27','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(106,6,5,5,'2024-08-28','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(107,6,5,5,'2024-08-29','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(108,6,5,5,'2024-08-30','09:00:00','09:30:00',3,3,'2024-06-27 02:19:30','2024-06-27 02:19:30',0),(109,6,5,5,'2024-06-22','09:30:00','10:00:00',3,3,'2024-06-27 02:21:05','2024-06-27 02:21:05',0),(110,9,7,5,'2024-06-27','10:00:00','11:00:00',5,5,'2024-06-27 03:18:13','2024-06-27 03:18:13',0),(111,9,7,9,'2024-06-27','10:00:00','11:00:00',4,4,'2024-06-27 05:40:08','2024-06-30 23:10:44',1),(112,5,4,5,'2024-07-01','09:00:00','10:00:00',5,5,'2024-06-27 06:06:59','2024-06-30 23:10:54',1),(113,5,4,5,'2024-07-01','10:00:00','11:00:00',5,5,'2024-06-27 06:07:51','2024-06-30 23:10:57',1),(114,5,4,5,'2024-07-01','11:00:00','12:00:00',5,5,'2024-06-27 06:08:13','2024-06-30 23:11:03',1),(115,5,4,5,'2024-07-01','14:00:00','15:00:00',5,5,'2024-06-27 06:08:32','2024-06-30 23:11:06',1),(116,5,4,5,'2024-07-01','16:00:00','17:00:00',4,4,'2024-06-27 06:08:56','2024-06-30 23:11:09',1),(117,5,4,5,'2024-06-27','15:00:00','16:00:00',5,5,'2024-06-27 06:23:00','2024-06-30 23:11:12',1),(118,5,4,5,'2024-08-01','09:00:00','12:00:00',10,10,'2024-06-27 08:20:49','2024-06-27 08:20:49',0),(119,5,4,5,'2024-09-24','15:00:00','16:00:00',5,5,'2024-06-27 08:33:23','2024-06-27 08:33:23',0),(120,5,4,5,'2024-09-25','15:00:00','16:00:00',5,5,'2024-06-27 08:33:23','2024-06-27 08:33:23',0),(121,5,4,5,'2024-09-26','15:00:00','16:00:00',5,5,'2024-06-27 08:33:23','2024-06-27 08:33:23',0),(122,5,4,5,'2024-10-01','15:00:00','16:00:00',5,5,'2024-06-27 08:33:23','2024-06-27 08:33:23',0),(123,5,4,5,'2024-10-02','15:00:00','16:00:00',5,5,'2024-06-27 08:33:23','2024-06-27 08:33:23',0),(124,5,4,5,'2024-10-09','15:00:00','16:00:00',5,5,'2024-06-27 08:33:23','2024-06-27 08:33:23',0),(125,5,4,5,'2024-10-03','15:00:00','16:00:00',5,5,'2024-06-27 08:33:23','2024-06-27 08:33:23',0),(126,5,4,5,'2024-10-08','15:00:00','16:00:00',5,5,'2024-06-27 08:33:23','2024-06-27 08:33:23',0),(127,5,4,5,'2024-10-10','15:00:00','16:00:00',5,5,'2024-06-27 08:33:23','2024-06-27 08:33:23',0),(128,7,4,5,'2024-08-01','10:00:00','11:00:00',3,3,'2024-06-27 11:34:05','2024-06-27 11:34:05',0),(129,5,4,5,'2024-08-01','09:00:00','10:00:00',5,5,'2024-06-27 11:38:41','2024-06-30 23:11:17',1),(130,5,4,5,'2024-08-01','10:00:00','11:00:00',5,5,'2024-06-27 11:42:39','2024-06-30 23:11:22',1),(131,5,4,5,'2024-08-01','11:00:00','12:00:00',5,5,'2024-06-27 11:43:18','2024-06-30 23:11:31',1),(132,5,5,5,'2024-08-01','09:00:00','10:00:00',5,5,'2024-06-27 11:47:18','2024-06-27 11:47:18',0),(133,6,5,8,'2024-08-01','09:00:00','10:00:00',5,5,'2024-06-27 11:56:53','2024-06-30 23:11:43',1);
/*!40000 ALTER TABLE `frames` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patientEmail` varchar(255) NOT NULL,
  `isNoti` tinyint(1) NOT NULL,
  `webInterview1` int(11) NOT NULL,
  `webInterview2` int(11) NOT NULL,
  `exam1` int(11) NOT NULL,
  `exam2` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
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
/*!40101 SET character_set_client = utf8 */;
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
  `frame` varchar(255) NOT NULL,
  `webURL` text NOT NULL,
  `webInterviewStatus` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,'はまだ　ななごー','ハマダ　ナナゴ','男性','1999-08-06','1234567890','gg.29.murai@gmail.com','8071306','福岡県','びこうらんここ','71','https://japan-clinic.com/webInterview?clinicId=8&pinfo=d909afba98b90a91791f204c9acd166d:1a456cd61089e606276f72ec1a903d7a72d561027867c1ef93fc80735ad0ec2a6cc413060d58a0df1b4bd9c342ce5ba91069c5c544245a1d083a81b985736399ec7f61cecf84b94dcfc96919a5bf6d72&frameId=71','予約','2024-07-03 00:10:54','2024-07-03 00:10:54',1);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clinic` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sort` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (4,'4','Room1','0','2024-05-20 08:05:50','2024-05-20 08:05:50',0),(5,'5','診察室1-1','clinic','2024-06-05 18:48:27','2024-07-01 22:01:51',1),(6,'8','内科①','clinic','2024-06-05 20:25:31','2024-07-01 22:01:46',1),(7,'5','診察室1-2','','2024-06-19 17:26:31','2024-06-19 17:26:31',1),(8,'8','内科②','','2024-06-21 09:11:49','2024-06-21 09:11:49',1),(9,'9','産婦人科①','','2024-06-21 09:12:20','2024-06-21 09:12:20',1),(10,'10','泌尿器①','','2024-06-21 09:15:01','2024-06-21 09:15:01',1);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `field` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'clinic','内科クリニック','2024-05-19 21:17:41'),(2,'reservationDescription','医療×WEB” 業界を専門としてきたgritsだからこそ、WEBマーケティングにて人々のメディカルIQの向上に寄与し治療の選択肢を増やせる世の中を実現させます。\n\n活動を行うにあたり、約20年程「医療×WEB」に特化した専門のディレクターがMedical grits事業を推進していき、先生方と共に「Medical grits Service」で人々のQOLを高めていけるように邁進していきます。','2024-05-19 21:17:58'),(3,'privacy','<b>プライバシーポリシー</b>\naaaaaaaaaaaaaaaaaa\n\n','2024-05-19 21:18:13'),(4,'clientName','1','2024-05-19 21:18:28'),(5,'clientFurigana','1','2024-05-19 21:18:45'),(6,'clientGender','1','2024-05-19 21:18:58'),(7,'clientDOB','1','2024-05-19 21:19:13'),(8,'reservationNum','1','2024-05-19 21:19:25'),(9,'phone','0','2024-05-19 21:19:35'),(10,'email','0','2024-05-19 21:19:47'),(11,'zipCode','0','2024-05-19 21:19:57'),(12,'address','0','2024-05-19 21:20:13'),(13,'additionalInfo','0','2024-05-19 21:20:24'),(14,'webBaseURL','https://test.cl1.cds.ai/preMonshin/#/','2024-05-19 21:20:38'),(15,'mailingScheduleDate','2','2024-05-19 21:20:48'),(16,'mailingTime','2','2024-05-19 21:21:01'),(17,'mailingDate','2024-05-15','2024-05-19 21:21:13'),(18,'dispClientName','@name@','2024-05-19 21:21:31'),(19,'dispClientDOB','@yoyakuymd@','2024-05-19 21:21:43'),(20,'dispClientURL','@url@','2024-05-19 21:21:50');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
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

-- Dump completed on 2024-07-03 10:06:31
