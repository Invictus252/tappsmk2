-- MySQL dump 10.15  Distrib 10.0.28-MariaDB, for debian-linux-gnueabihf (armv7l)
--
-- Host: TappsDB    Database: TappsDB
-- ------------------------------------------------------
-- Server version	10.0.28-MariaDB-2+b1

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
-- Current Database: `TappsDB`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `TappsDB` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `TappsDB`;

--
-- Table structure for table `ScanResults`
--

DROP TABLE IF EXISTS `ScanResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ScanResults` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `DeviceName` tinytext NOT NULL,
  `Mac` varchar(150) NOT NULL,
  `OUI` varchar(150) NOT NULL,
  `Power` int(11) NOT NULL,
  `Distance` decimal(5,2) NOT NULL,
  `FirstTimeSeen` datetime DEFAULT NULL,
  `LastTimeSeen` datetime DEFAULT NULL,
  `ScanGroup` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `U_Scan` (`Mac`,`Power`,`LastTimeSeen`),
  KEY `ScanGroup` (`ScanGroup`),
  CONSTRAINT `ScanResults_ibfk_1` FOREIGN KEY (`ScanGroup`) REFERENCES `StoredScans` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ScanResults`
--

LOCK TABLES `ScanResults` WRITE;
/*!40000 ALTER TABLE `ScanResults` DISABLE KEYS */;
INSERT INTO `ScanResults` VALUES (1,'ALPHA','B8:27:EB:B6:96:76','Raspberry Pi Foundation',-30,1.02,'2020-11-14 03:33:59','2020-11-14 03:33:59',1),(2,'ALPHA','B8:27:EB:7E:3A:D3','Raspberry Pi Foundation',-38,2.57,'2020-11-14 03:33:59','2020-11-14 03:34:11',1),(3,'ALPHA','68:EC:C5:2A:A6:7A','Intel Corporate',-44,5.13,'2020-11-14 03:34:12','2020-11-14 03:34:18',1),(4,'ALPHA','D8:31:34:4E:36:0F','Roku, Inc',-28,0.81,'2020-11-14 03:33:51','2020-11-14 03:34:29',1),(5,'ALPHA','2A:7D:90:92:13:F4','Unknown',-72,128.89,'2020-11-14 03:34:06','2020-11-14 03:34:06',1),(6,'CHARLIE','B8:27:EB:B6:96:76','Raspberry Pi Foundation',-20,0.32,'2020-11-14 03:33:59','2020-11-14 03:33:59',1),(7,'CHARLIE','B8:27:EB:7E:3A:D3','Raspberry Pi Foundation',-44,5.13,'2020-11-14 03:33:59','2020-11-14 03:34:11',1),(8,'CHARLIE','68:EC:C5:2A:A6:7A','Intel Corporate',-50,10.24,'2020-11-14 03:33:55','2020-11-14 03:34:25',1),(9,'CHARLIE','D8:31:34:4E:36:0F','Roku, Inc',-36,2.04,'2020-11-14 03:33:51','2020-11-14 03:34:21',1),(10,'BRAVO','B8:27:EB:B6:96:76','Raspberry Pi Foundation',-24,0.51,'2020-11-14 02:26:36','2020-11-14 02:26:36',1),(11,'BRAVO','68:EC:C5:2A:A6:7A','Intel Corporate',-58,25.72,'2020-11-14 02:26:32','2020-11-14 02:27:02',1),(12,'BRAVO','D8:31:34:4E:36:0F','Roku, Inc',-38,2.57,'2020-11-14 02:26:28','2020-11-14 02:27:05',1),(13,'CHARLIE','68:EC:C5:2A:A6:7A','Intel Corporate',-50,10.24,'2020-11-14 03:36:19','2020-11-14 03:36:24',2),(14,'CHARLIE','B8:27:EB:B6:96:76','Raspberry Pi Foundation',-18,0.26,'2020-11-14 03:36:24','2020-11-14 03:36:24',2),(15,'CHARLIE','D8:31:34:4E:36:0F','Roku, Inc',-34,1.62,'2020-11-14 03:36:24','2020-11-14 03:36:24',2),(16,'BRAVO','68:EC:C5:2A:A6:7A','Intel Corporate',-60,32.38,'2020-11-14 02:28:57','2020-11-14 02:28:57',2),(17,'BRAVO','D8:31:34:4E:36:0F','Roku, Inc',-44,5.13,'2020-11-14 02:28:59','2020-11-14 02:28:59',2),(18,'CHARLIE','C4:6E:1F:41:59:6D','TP-LINK TECHNOLOGIES CO.,LTD.',-78,257.18,'2020-11-14 03:36:29','2020-11-14 03:36:48',2),(20,'CHARLIE','68:EC:C5:2A:A6:7A','Intel Corporate',-60,32.38,'2020-11-14 03:36:19','2020-11-14 03:36:49',2),(21,'CHARLIE','D8:31:34:4E:36:0F','Roku, Inc',-28,0.81,'2020-11-14 03:36:24','2020-11-14 03:36:46',2),(23,'ALPHA','2A:7D:90:92:13:F4','Unknown',-72,128.89,'2020-11-14 03:36:36','2020-11-14 03:36:36',2),(24,'ALPHA','D8:31:34:4E:36:0F','Roku, Inc',-28,0.81,'2020-11-14 03:36:33','2020-11-14 03:36:44',2),(27,'CHARLIE','C4:6E:1F:41:59:6D','TP-LINK TECHNOLOGIES CO.,LTD.',-80,323.76,'2020-11-14 03:36:29','2020-11-14 03:36:59',2),(28,'ALPHA','B8:27:EB:B6:96:76','Raspberry Pi Foundation',-30,1.02,'2020-11-14 03:36:59','2020-11-14 03:36:59',2),(29,'CHARLIE','B8:27:EB:B6:96:76','Raspberry Pi Foundation',-18,0.26,'2020-11-14 03:36:24','2020-11-14 03:36:50',2),(30,'ALPHA','B8:27:EB:7E:3A:D3','Raspberry Pi Foundation',-6,0.06,'2020-11-14 03:36:59','2020-11-14 03:36:59',2),(31,'CHARLIE','B8:27:EB:7E:3A:D3','Raspberry Pi Foundation',-30,1.02,'2020-11-14 03:36:50','2020-11-14 03:36:50',2),(33,'ALPHA','D8:31:34:4E:36:0F','Roku, Inc',-30,1.02,'2020-11-14 03:36:33','2020-11-14 03:36:59',2),(34,'CHARLIE','68:EC:C5:2A:A6:7A','Intel Corporate',-52,12.89,'2020-11-14 03:36:19','2020-11-14 03:36:50',2),(36,'BRAVO','B8:27:EB:B6:96:76','Raspberry Pi Foundation',-24,0.51,'2020-11-14 02:29:41','2020-11-14 02:29:41',2),(37,'ALPHA','2A:7D:90:92:13:F4','Unknown',-72,128.89,'2020-11-14 03:36:36','2020-11-14 03:37:06',2),(38,'CHARLIE','D8:31:34:4E:36:0F','Roku, Inc',-30,1.02,'2020-11-14 03:36:24','2020-11-14 03:36:57',2),(39,'BRAVO','D8:31:34:4E:36:0F','Roku, Inc',-38,2.57,'2020-11-14 02:28:59','2020-11-14 02:29:30',2);
/*!40000 ALTER TABLE `ScanResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SecurityQuestions`
--

DROP TABLE IF EXISTS `SecurityQuestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SecurityQuestions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Question` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SecurityQuestions`
--

LOCK TABLES `SecurityQuestions` WRITE;
/*!40000 ALTER TABLE `SecurityQuestions` DISABLE KEYS */;
INSERT INTO `SecurityQuestions` VALUES (1,'What is your father\'s middle name?'),(2,'What was the name of your first pet?'),(3,'What was your first car?'),(4,'What is your favorite video game?'),(5,'What is your favorite programming language?');
/*!40000 ALTER TABLE `SecurityQuestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StoredScans`
--

DROP TABLE IF EXISTS `StoredScans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StoredScans` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `TimeStamp` datetime NOT NULL,
  `Location` varchar(50) NOT NULL,
  `Notes` varchar(255) NOT NULL,
  `FileName` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `U_StoredScan` (`TimeStamp`,`Location`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StoredScans`
--

LOCK TABLES `StoredScans` WRITE;
/*!40000 ALTER TABLE `StoredScans` DISABLE KEYS */;
INSERT INTO `StoredScans` VALUES (1,'2020-11-14 02:25:29','test1','test1','test1'),(2,'2020-11-14 02:28:40','test2','test2','test2');
/*!40000 ALTER TABLE `StoredScans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(60) NOT NULL,
  `UserName` varchar(100) NOT NULL,
  `AuthLevel` int(11) NOT NULL,
  `SecurityQuestion1Id` int(11) NOT NULL,
  `SecurityQuestion2Id` int(11) NOT NULL,
  `SecurityAnswer1` varchar(100) NOT NULL,
  `SecurityAnswer2` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email` (`Email`),
  KEY `SecurityQuestion1Id` (`SecurityQuestion1Id`),
  KEY `SecurityQuestion2Id` (`SecurityQuestion2Id`),
  CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`SecurityQuestion1Id`) REFERENCES `SecurityQuestions` (`Id`),
  CONSTRAINT `Users_ibfk_2` FOREIGN KEY (`SecurityQuestion2Id`) REFERENCES `SecurityQuestions` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'admin','$2a$12$Ju1FK4bHNjfBBYXcJyzVquXFdMNdIeiDh4a8XTs9Tr5TNc95er/wC','Admin',1,1,2,'$2a$12$1IiZalKMwnr.ZqKcVb/dNugXmAPzrvon0XazzwJe/lU91cdH9qK3W','$2a$12$1IiZalKMwnr.ZqKcVb/dNugXmAPzrvon0XazzwJe/lU91cdH9qK3W'),(2,'test@test.com','$2a$12$Wvc14igfLTDJZVXgW2cfj.40c2Rhy7FAwMFQygETtsP9fDHs2OGpa','Test',2,1,2,'$2a$12$1IiZalKMwnr.ZqKcVb/dNugXmAPzrvon0XazzwJe/lU91cdH9qK3W','$2a$12$1IiZalKMwnr.ZqKcVb/dNugXmAPzrvon0XazzwJe/lU91cdH9qK3W');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-17 15:27:00
