-- MySQL dump 10.13  Distrib 5.6.24, for Win64 (x86_64)
--
-- Host: 52.11.166.255    Database: hotspotting
-- ------------------------------------------------------
-- Server version	5.6.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `alloutfits`
--

DROP TABLE IF EXISTS `alloutfits`;
/*!50001 DROP VIEW IF EXISTS `alloutfits`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `alloutfits` AS SELECT 
 1 AS `id_outfit`,
 1 AS `celebrity_id`,
 1 AS `image_url`,
 1 AS `description`,
 1 AS `date`,
 1 AS `id_celebrity`,
 1 AS `celebrity`,
 1 AS `thumbnail_url`,
 1 AS `picture_url`,
 1 AS `favourites`,
 1 AS `following`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id_category` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_category`),
  UNIQUE KEY `category_UNIQUE` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (2,'accessories'),(1,'clothing'),(3,'house');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `celebrities`
--

DROP TABLE IF EXISTS `celebrities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `celebrities` (
  `id_celebrity` int(11) NOT NULL AUTO_INCREMENT,
  `celebrity` varchar(45) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `picture_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_celebrity`),
  UNIQUE KEY `celebrity_UNIQUE` (`celebrity`),
  UNIQUE KEY `thumbnail_url_UNIQUE` (`thumbnail_url`),
  UNIQUE KEY `picture_url_UNIQUE` (`picture_url`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `celebrities`
--

LOCK TABLES `celebrities` WRITE;
/*!40000 ALTER TABLE `celebrities` DISABLE KEYS */;
INSERT INTO `celebrities` VALUES (1,'Chrissy Teigen','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_mobile_1x/public/celebs/Screen%20Shot%202014-10-25%20at%201.45.17%20PM.jpg?itok=Swtx7GCP','http://52.11.166.255:8080/hotspotting/pictures/celebrities/chrissy-teigen-banner.jpg'),(2,'Ariana Grande','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_mobile_1x/public/celebs/ArianaGrande.jpg?itok=1YHnRxMq','http://52.11.166.255:8080/hotspotting/pictures/celebrities/ariana-grande-banner.jpg'),(3,'Taylor Swift','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Taylor%20S.jpg?itok=OtOFGZSM','http://52.11.166.255:8080/hotspotting/pictures/celebrities/taylor-swift-banner.jpg'),(4,'Rosie Huntington-Whiteley','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Rosie%20H3.jpg?itok=nqEAWU0s','http://52.11.166.255:8080/hotspotting/pictures/celebrities/rosie-huntington-whiteley-banner.jpg'),(5,'Selena Gomez','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Selena.jpg?itok=olQBtomN','http://52.11.166.255:8080/hotspotting/pictures/celebrities/selena-gomez-banner.jpg'),(6,'Kendall Jenner','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Screen%20Shot%202014-10-07%20at%208.16.52%20AM.jpg','http://52.11.166.255:8080/hotspotting/pictures/celebrities/kendall-jenner-banner.jpg'),(7,'Gwen Stefani','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Gwen.jpg?itok=D29-EczO','http://wallpapersboom.net/wp-content/uploads/2015/08/3975_gwen_stefani.jpg'),(8,'Reese Witherspoon','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Reese.jpg?itok=IGfXi-tB','http://www.hdwallpapers.in/walls/reese_witherspoon_2012-wide.jpg'),(9,'Fergie','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/580876_10151221535253676_851063930_n.jpg?itok=W27Mt0h7','http://52.11.166.255:8080/hotspotting/pictures/celebrities/fergie-banner.jpg'),(10,'Khloé Kardashian','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/khloe%20K.jpg?itok=1f2L32qI','http://52.11.166.255:8080/hotspotting/pictures/celebrities/khloe-kardashian-banner.jpg'),(11,'Jessica Alba','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/jessica%20A.jpg?itok=zy1WFjEI','http://52.11.166.255:8080/hotspotting/pictures/celebrities/jessica-alba-banner.jpg'),(12,'Bella Thorne','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Bella.jpg?itok=XZbCE9Gq','http://52.11.166.255:8080/hotspotting/pictures/celebrities/bella-thorne-banner.jpg'),(13,'Heidi Klum','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Screen%20Shot%202014-10-25%20at%201.47.09%20PM.jpg','pictures/celebrities/Heidiklum.jpg'),(14,'Beyoncé','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/beyonce.jpg','http://52.11.166.255:8080/hotspotting/pictures/celebrities/beyonce-banner.jpg'),(15,'Gigi Hadid','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/GIGI%20profile%20.jpg','pictures/celebrities/GigiHadid.jpg'),(19,'Olivia Palermo','https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Screen%20Shot%202014-10-25%20at%201.38.55%20PM.jpg','http://52.11.166.255:8080/hotspotting/pictures/celebrities/olivia-palermo-banner.jpg'),(24,'Emily Ratajkowski','http://52.11.166.255:8080/hotspotting/pictures/celebrities/emilyratajkowski_profile.jpg',NULL),(25,'Kim Kardashian','http://52.11.166.255:8080/hotspotting/pictures/celebrities/kimk_profile.jpg',NULL),(26,'Ashley Benson','http://52.11.166.255:8080/hotspotting/pictures/celebrities/ashley_benson.jpg','pictures/celebrities/AshleyBenson.jpg'),(30,'Candice Swanepoel','uploads/candice_swanepoel_ava.jpg','pictures/celebrities/CandiceSwanepoel.jpg'),(31,'Eva Longoria','uploads/eva_longoria_ava.jpg','pictures/celebrities/EvaLongoria.jpg'),(33,'Jennifer Lopez','uploads/jennifer_lopez_ava.jpg','pictures/celebrities/JenniferLopez.jpg'),(34,'Jessica Simpson','uploads/jessica_simpson_ava.jpg',NULL);
/*!40000 ALTER TABLE `celebrities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favourites`
--

DROP TABLE IF EXISTS `favourites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favourites` (
  `id_favourite` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `outfit_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_favourite`),
  KEY `user_id_idx` (`user_id`),
  KEY `post_id_idx` (`outfit_id`),
  CONSTRAINT `post_id` FOREIGN KEY (`outfit_id`) REFERENCES `outfits` (`id_outfit`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favourites`
--

LOCK TABLES `favourites` WRITE;
/*!40000 ALTER TABLE `favourites` DISABLE KEYS */;
INSERT INTO `favourites` VALUES (14,25,6),(19,25,10),(38,26,41),(46,25,36),(61,26,71),(65,26,40),(66,26,10),(67,26,6),(70,26,36),(71,26,7),(78,36,5),(100,26,101),(105,46,40),(106,46,10),(107,46,1),(108,46,2),(120,27,101),(140,48,101),(142,46,7),(154,47,104),(157,47,101),(161,25,101),(162,25,88),(168,27,104),(170,37,123);
/*!40000 ALTER TABLE `favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `following`
--

DROP TABLE IF EXISTS `following`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `following` (
  `id_following` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `celebrity_id` int(11) NOT NULL,
  PRIMARY KEY (`id_following`),
  KEY `user_id` (`user_id`),
  KEY `celebrity_id` (`celebrity_id`),
  CONSTRAINT `follow_celebrity_id` FOREIGN KEY (`celebrity_id`) REFERENCES `celebrities` (`id_celebrity`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `follow_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `following`
--

LOCK TABLES `following` WRITE;
/*!40000 ALTER TABLE `following` DISABLE KEYS */;
INSERT INTO `following` VALUES (3,25,6),(30,25,11),(40,25,9),(48,36,19),(79,44,8),(88,46,12),(90,47,5),(95,27,2),(102,46,6),(107,52,26),(110,47,6),(113,37,2),(189,56,11),(190,56,12),(191,56,19),(192,56,2);
/*!40000 ALTER TABLE `following` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `garments`
--

DROP TABLE IF EXISTS `garments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `garments` (
  `id_garment` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `garment` varchar(45) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_garment`),
  KEY `category_id_idx` (`category_id`),
  CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id_category`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `garments`
--

LOCK TABLES `garments` WRITE;
/*!40000 ALTER TABLE `garments` DISABLE KEYS */;
INSERT INTO `garments` VALUES (1,1,'woman','Dresses','pictures/app/woman/DRESSES.jpg','pictures/app/tags/DRESSES.svg'),(2,2,'woman','Bags','pictures/app/woman/BAGS.jpg','pictures/app/tags/BAGS.svg'),(3,1,'woman','Shoes','pictures/app/woman/SHOES.jpg','pictures/app/tags/SHOES.svg'),(4,2,'woman','Glasses','pictures/app/woman/GLASSES.jpg','pictures/app/tags/GLASSES.svg'),(5,1,'woman','Tops','pictures/app/woman/TOPS.jpg','pictures/app/tags/TOPS.svg'),(6,1,'woman','Shorts','pictures/app/woman/SHORTS.jpg','pictures/app/tags/SHORTS.svg'),(7,1,'woman','Skirts','pictures/app/woman/SKIRTS.jpg','pictures/app/tags/SKIRTS.svg'),(8,1,'woman','Pants','pictures/app/woman/PANTS.jpg','pictures/app/tags/PANTS.svg'),(9,1,'woman','Jumpsuits','pictures/app/woman/JUMPSUITS.jpg','pictures/app/tags/JUMPSUITS.svg'),(10,1,'woman','Bodysuits','pictures/app/woman/BODYSUITS.jpg','pictures/app/tags/BODYSUITS.svg'),(11,1,'woman','Jackets','pictures/app/woman/JACKETS.jpg','pictures/app/tags/JACKETS.svg'),(12,1,'woman','Sweaters','pictures/app/woman/SWEATERS.jpg','pictures/app/tags/SWEATERS.svg'),(13,2,'woman','Jewelry','pictures/app/woman/JEWELRY.jpg','pictures/app/tags/JEWELRY.svg'),(14,1,'woman','Activewear','pictures/app/woman/ACTIVEWEAR.jpg','pictures/app/tags/ACTIVEWEAR.svg'),(15,2,'woman','Beauty','pictures/app/woman/BEAUTY.jpg','pictures/app/tags/BEAUTY.svg'),(16,2,'woman','Belts','pictures/app/woman/BELTS.jpg','pictures/app/tags/BELTS.svg'),(17,1,'woman','Bralette','pictures/app/woman/BRALETTE.jpg','pictures/app/tags/BRALETTE.svg'),(18,2,'woman','Gloves','pictures/app/woman/GLOVES.jpg','pictures/app/tags/GLOVES.svg'),(19,2,'woman','Hats','pictures/app/woman/HATS.jpg','pictures/app/tags/HATS.svg'),(20,3,'woman','Home','pictures/app/woman/HOME.jpg','pictures/app/tags/HOME.svg'),(21,1,'woman','Lingerie','pictures/app/woman/LINGERIE.jpg','pictures/app/tags/LINGERIE.svg'),(22,1,'woman','Overalls','pictures/app/woman/OVERALLS.jpg','pictures/app/tags/OVERALLS.svg'),(23,1,'woman','Pajamas','pictures/app/woman/PAJAMAS.jpg','pictures/app/tags/PAJAMAS.svg'),(24,2,'woman','Perfume','pictures/app/woman/PERFUME.jpg','pictures/app/tags/PERFUME.svg'),(25,2,'woman','Polish','pictures/app/woman/POLISH.jpg','pictures/app/tags/POLISH.svg'),(26,1,'woman','Poncho','pictures/app/woman/PONCHO.jpg','pictures/app/tags/PONCHO.svg'),(27,2,'woman','Scarves','pictures/app/woman/SCARVES.jpg','pictures/app/tags/SCARVES.svg'),(28,1,'woman','Swimwear','pictures/app/woman/SWIMWEAR.jpg','pictures/app/tags/SWIMWEAR.svg'),(29,1,'woman','Tights','pictures/app/woman/TIGHTS.jpg','pictures/app/tags/TIGHTS.svg'),(30,1,'woman','Vests','pictures/app/woman/VESTS.jpg','pictures/app/tags/VESTS.svg'),(31,2,'woman','Watches','pictures/app/woman/WATCHES.jpg','pictures/app/tags/WATCHES.svg'),(32,1,'man','Jackets','pictures/app/man/JACKETS.jpg','pictures/app/tags/JACKETS.svg'),(33,1,'man','Pants','pictures/app/man/PANTS.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/BAGS.svg'),(34,2,'man','Scarves','pictures/app/man/SCARVES.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/BELTS.svg'),(35,1,'man','Shirts','pictures/app/man/SHIRTS.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/GLASSES.svg'),(36,1,'man','Shoes','pictures/app/man/HATS.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/HATS.svg'),(37,1,'man','Shorts','pictures/app/man/SHORTS.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/HEADPHONES.svg'),(38,1,'man','Suits','pictures/app/man/SUITS.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/SUITS.svg'),(39,1,'man','Sweaters','pictures/app/man/SWEATERS.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/PANTS.svg'),(40,1,'man','Swimwear','pictures/app/man/SWIMWEAR.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/SCARVES.svg'),(41,2,'man','Ties','pictures/app/man/TIES.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/SHIRTS.svg'),(42,1,'man','Underwear','pictures/app/man/UNDERWEAR.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/SHOES.svg'),(43,2,'man','Watches','pictures/app/man/WATCHES.jpg','http://52.11.166.255:8080/hotspotting/pictures/app/tags/SHORTS.svg');
/*!40000 ALTER TABLE `garments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_access_tokens`
--

DROP TABLE IF EXISTS `oauth_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_access_tokens` (
  `access_token` varchar(100) NOT NULL,
  `client_id` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`access_token`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_access_tokens`
--

LOCK TABLES `oauth_access_tokens` WRITE;
/*!40000 ALTER TABLE `oauth_access_tokens` DISABLE KEYS */;
INSERT INTO `oauth_access_tokens` VALUES ('c47018e274006ad346eb42d9393918cb7ab2c7e4','gjoforte',1,'2015-10-24 23:23:06');
/*!40000 ALTER TABLE `oauth_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_clients`
--

DROP TABLE IF EXISTS `oauth_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_clients` (
  `client_id` varchar(50) NOT NULL,
  `client_secret` varchar(32) NOT NULL,
  `redirect_uri` varchar(100) NOT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_clients`
--

LOCK TABLES `oauth_clients` WRITE;
/*!40000 ALTER TABLE `oauth_clients` DISABLE KEYS */;
INSERT INTO `oauth_clients` VALUES ('gjoforte','123qwe','http://localhost:3000/oauth/cenas');
/*!40000 ALTER TABLE `oauth_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_refresh_tokens`
--

DROP TABLE IF EXISTS `oauth_refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_refresh_tokens` (
  `refresh_token` varchar(100) NOT NULL,
  `client_id` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`refresh_token`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_refresh_tokens`
--

LOCK TABLES `oauth_refresh_tokens` WRITE;
/*!40000 ALTER TABLE `oauth_refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outfits`
--

DROP TABLE IF EXISTS `outfits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `outfits` (
  `id_outfit` int(11) NOT NULL AUTO_INCREMENT,
  `celebrity_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_outfit`),
  UNIQUE KEY `image_url_UNIQUE` (`image_url`),
  KEY `celebrity_id_idx` (`celebrity_id`),
  CONSTRAINT `celebrity_id` FOREIGN KEY (`celebrity_id`) REFERENCES `celebrities` (`id_celebrity`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outfits`
--

LOCK TABLES `outfits` WRITE;
/*!40000 ALTER TABLE `outfits` DISABLE KEYS */;
INSERT INTO `outfits` VALUES (1,2,'uploads/Arianajumpsuit.jpg','Ariana wears a jumpsuit and sky high pumps for the Jimmy Fallon Show.','2015-10-17 02:28:25'),(2,1,'uploads/ChrissyXOXO_0.jpg','Leather and leopard are fall wardrobe necessities.','2015-10-14 14:32:25'),(3,9,'uploads/spl1153043_023.jpg','Fergie promotes her footwear at Lord & Taylor.','2015-10-17 14:30:38'),(4,10,'uploads/KhloeCosmo.jpg','Khloé wears Cushnie et Ochs for Cosmopolitan.','2015-10-18 14:33:31'),(5,11,'uploads/JessicaKarenKane.jpg','Effortlessly stylish.','2015-10-18 14:34:42'),(6,12,'uploads/FFN_Thorne_Bella_JKING_semi_100815_51874151.jpg','Bella rocks a leather mini dress at the Vancouver airport.','2015-10-18 14:36:19'),(7,6,'uploads/KendallBarneys.jpg','Kendall\'s seen shopping at Barney\'s.','2015-10-18 21:40:29'),(8,5,'uploads/SelGmeshdress.jpg','Selena sports a sleek look by Cushnie et Ochs.','2015-10-18 23:55:04'),(9,4,'uploads/rosiehwairport .jpg','Rosie jets to LA.','2015-10-18 23:55:50'),(10,3,'uploads/TaylorGq.jpg','Sultry and sexy for GQ','2015-10-18 23:57:03'),(11,13,'uploads/FFN_PabloFF_Klum_Heidi_101715_51881540.jpg','Heidi searches for the perfect pumpkin with her daughter.','2015-10-18 23:58:03'),(12,5,'uploads/SelenaTheVoice_0.jpg','Selena makes an appearance on The Voice.','2015-10-19 00:41:03'),(36,14,'uploads/BeyonceSibling.jpg','Beyoncé poses in a striped dress and sneakers.','2015-10-28 15:14:21'),(40,6,'uploads/KjDavidKoma.jpg','Out and about with Cara','2015-10-29 07:27:38'),(41,9,'uploads/FergiePinkDress.jpg','Avon fragrance launch in New York','2015-10-30 00:10:32'),(71,19,'uploads/Oliviaphotoshoot.jpg','Holts Muse photo shoot','2015-10-30 01:47:10'),(88,12,'uploads/BTGlamourNew.jpg','Mexico Glamour','2015-12-08 01:29:25'),(101,15,'uploads/GigiVogue.jpg','Wearing Gucci for Vogue Magazine','2015-12-08 16:36:02'),(104,26,'uploads/ashley-benson-beverly-hills.jpg','Ashley Benson walking the streets of Beverly Hills','2015-12-17 23:48:17'),(111,30,'uploads/candice_swanepoel_1.jpg','Candice Swanepoel looking sharp.','2015-12-19 02:53:39'),(112,31,'uploads/eva_longoria_1.jpg','Eva Longoria says hi to the paparazzi.','2015-12-19 03:18:19'),(119,15,'uploads/gigi_hadid_1.jpg','Gigi Hadid looking good.','2015-12-19 03:47:14'),(120,15,'uploads/gigi_hadid_2.jpg','Gigi Hadid Dressed in black.','2015-12-19 04:21:17'),(121,13,'uploads/heidi_klum_1.jpg','Winter with Heidi Klum.','2015-12-19 04:34:03'),(122,33,'uploads/jennifer_lopez_1.jpg','Jennifer Lopez backstage.','2015-12-19 04:50:09'),(123,34,'uploads/jessica_simpson_1.jpg','Dressed in black','2015-12-19 07:01:30');
/*!40000 ALTER TABLE `outfits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id_product` int(11) NOT NULL AUTO_INCREMENT,
  `tag_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `url` varchar(255) NOT NULL,
  `color` varchar(7) NOT NULL,
  PRIMARY KEY (`id_product`),
  KEY `tag_id_fk` (`tag_id`),
  CONSTRAINT `tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id_tag`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,353,'pictures/products/jessicasimpson_bag_barneys_7250.jpg','Fendi',7250,'http://www.barneys.com/Fendi-Peekaboo-Large-Satchel-504220532.html?utm_source=J84DHJLQkR4&utm_medium=affiliate&siteID=J84DHJLQkR4-6MQkBhcyUqnwljuhNlVsFg','#d8cbc5'),(2,354,'pictures/products/jenniferlopez_glasses_barneys_425.jpg','Dita',425,'http://www.barneys.com/Dita-Condor-Two-Aviator-Sunglasses-503410036.html?utm_source=J84DHJLQkR4&utm_medium=affiliate&siteID=J84DHJLQkR4-jBCk.AYvJPoKPnwsBjG0Bg','#cec8c0'),(3,356,'pictures/products/jenniferlopez_shoes_barneys_625.jpg','Adidas Originals',625,'http://www.barneys.com/adidas-Originals-by-Kanye-West-YEEZY-SEASON-1-Women\'s-Yeezy-950-Boots-504325158.html?utm_source=J84DHJLQkR4&utm_medium=affiliate&siteID=J84DHJLQkR4-pxizHrtqIkFuTauq2lK3Og','#dfcfc3'),(4,357,'pictures/products/jenniferlopez_bags_farfetch_16899.jpg','Hermès Vintage',16899,'http://www.farfetch.com/shopping/women/Hermes-Vintage-Kelly-tote-item-11119546.aspx?fsb=1','#cdc8cf'),(5,331,'pictures/products/heidiklum_jackets_elizabethandjames_1197.jpg','Elizabeth And James',1197,'http://www.revolveclothing.com/elizabeth-and-james-hart-tibetan-lamb-fur-coat-in-nude/dp/EAND-WO201/?d=F&currency=USD&utm_campaign=57486&utm_medium=affiliate&source=ir&utm_source=ir','#fae5d3'),(6,332,'pictures/products/heidiklum_shoes_saintlaurent_352.jpg','Saint Laurent',325,'https://www.therealreal.com/products/women/shoes/sneakers/saint-laurent-sneakers-52?sid=ncvyyf&cvosrc=affiliate.shareasale.595441','#ffffff'),(7,323,'pictures/products/gigihadid_glasses_karenwalker_250.jpg','Karen Walker',250,'https://www.shopbop.com/deep-freeze-sunglasses-karen-walker/vp/v=1/1556627792.htm','#9a989a'),(8,324,'pictures/products/gigihadid_sweaters_nililotan_890.jpg','Nili Lotan',890,'http://www.polyvore.com/nili_lotan_aran_cashmere_turtleneck/thing?id=152952500','#9f9e9f'),(9,325,'pictures/products/gigihadid_skirts_nililotan_811.jpg','Nili Lotan',811,'http://www.farfetch.com/pt/shopping/women/item11235700.aspx?q=11235700','#9f9e9f'),(10,326,'pictures/products/gigihadid_shoes_stuartweitzman_773.jpg','Stuart Weitzman',774,'http://www.saksfifthavenue.com/main/ProductDetail.jsp?PRODUCT%3C%3Eprd_id=845524446602284','#9f9e9f'),(11,318,'pictures/products/gigihadid_glasses_rayban_160.jpg','Ray-Ban',160,'http://www.revolveclothing.com/rayban-metal-flash-lense-aviator-in-matte-gold-orange-flash/dp/RAYB-UG6/?d=U&currency=USD','#f8b1a6'),(12,319,'pictures/products/gigihadid_dresses_selfridges_295.jpg','Selfridges',295,'http://www.selfridges.com/GB/en/cat/self-portrait-militaire-crepe-maxi-dress_234-3003847-SP8006','#f7dfce'),(13,320,'pictures/products/gigihadid_shoes_kurtgeiger_450.jpg','Kurt Geiger',450,'http://www.kurtgeiger.us/britton-nude-leather-patent-39-kurt-geiger-london-shoe.html','#e8d8d1'),(14,321,'pictures/products/gigihadid_jackets_missguided_119.jpg','Missguided',119,'https://www.missguidedus.com/new-in/back-in-stock/oversized-wool-coat-camel-camel','#d6bdb0'),(15,353,'pictures/products/jessicasimpson_bags_fendi_6250_a.jpg','Fendi',6250,'http://www.barneys.com/Fendi-Peekaboo-Shearling-Satchel-504220558.html','#d4c9bc'),(16,353,'pictures/products/jessicasimpson_bags_fendi_6000_b.jpg','Fendi',6000,'http://www.barneys.com/Fendi-Selleria-Peekaboo-Medium-Satchel-503217524.html','#e4e4e4'),(17,353,'pictures/products/jessicasimpson_bags_fendi_3950_c.jpg','Fendi',3950,'http://www.barneys.com/Fendi-Peekaboo-Satchel-504044431.html','#fbcfc5'),(18,353,'pictures/products/jessicasimpson_bags_fendi_4150_d.jpg','Fendi',4150,'http://www.barneys.com/Fendi-Peekaboo-Pochette-504220548.html','#dcbdbd'),(19,354,'pictures/products/jenniferlopez_glasses_dita_425_a.jpg','Dita',425,'http://www.barneys.com/Dita-Condor-Two-Aviator-Sunglasses-503410034.html','#eedecb'),(20,354,'pictures/products/jenniferlopez_glasses_bartonpereira_445_b.jpg','Barton Pereira',445,'http://www.barneys.com/Barton-Perreira-Quimby-Sunglasses-504304308.html','#f2e1eb'),(21,354,'pictures/products/jenniferlopez_glasses_dior_465_c.jpg','Dior',465,'http://www.barneys.com/Dior-%22Dior-Sideral2%22-Sunglasses-504246937.html','#cad2de'),(22,354,'pictures/products/jenniferlopez_glasses_dita_425_d.jpg','Dita',425,'http://www.barneys.com/Dita-Bluebird-Two-Sunglasses-503410030.html','#dcd2da'),(23,357,'pictures/products/jenniferlopez_bags_hermes_949_a.jpg','Hermès Vintage',949,'http://www.farfetch.com/shopping/item11010641.aspx','#e9e8e3'),(24,357,'pictures/products/jenniferlopez_bags_hermes_949_b.jpg','Hermès Vintage',949,'http://www.farfetch.com/shopping/item11062884.aspx','#f5cdad'),(25,357,'pictures/products/jenniferlopez_bags_chanel_5199_c.jpg','Chanel Vintage',5199,'http://www.farfetch.com/shopping/item11062864.aspx','#d0d0d1'),(26,357,'pictures/products/jenniferlopez_bags_louisvuitton_749_d.jpg','Louis Vuitton Vintage',749,'http://www.farfetch.com/shopping/item11085169.aspx','#ffb8bc'),(27,331,'pictures/products/heidiklum_jackets_elizabethandjames_1047_a.jpg','Elizabeth And James',1047,'http://www.revolveclothing.com/holland-coyote-and-rabbit-fur-coat/dp/EAND-WO198/?d=Womens','#ccd0dc'),(28,331,'pictures/products/heidiklum_jackets_pfeiffer_369_b.jpg','Pfeiffer',369,'http://www.revolveclothing.com/alexis-gathered-dress/dp/PFER-WD8/?d=Womens','#f7f6f3'),(29,331,'pictures/products/heidiklum_jackets_eaves_998_c.jpg','Eaves',998,'http://www.revolveclothing.com/fox-fur-helen-jacket/dp/EAVR-WO10/?d=Womens','#ddd2d2'),(30,331,'pictures/products/heidiklum_jackets_novellaroyale_99_d.jpg','Novella Royale',99,'http://www.revolveclothing.com/kid-mini-dress/dp/NOVE-WD32/?d=Womens','#d0c9c6'),(31,310,'pictures/products/evalongoria_tops_davidkoma_1056.jpg','David Koma',1056,'http://www.shopstyle.com/g/women/david-koma/frilled-sleeve-sweater','#f5e0ca'),(32,311,'pictures/products/evalongoria_skirts_davidkoma_539.jpg','David Koma',539,'http://www.bergdorfgoodman.com/David-Koma-Two-Tone-Sleeveless-Open-Back-Top-Wool-Midi-Skirt-w-Leather-Pockets/prod112170041_cat441206__/p.prod?ecid=BGALRZ77QPydcorE','#f1e5d8'),(33,303,'pictures/products/candiceswanepoel_jackets_wesgordon_4450.jpg','Wes Gordon',4450,'https://www.modaoperandi.com/wes-gordon-ss15/single-breasted-belted-trench-coat??mid=37385','#e9dccd'),(34,304,'pictures/products/candiceswanepoel_dresses_nookie_209.jpg','Nookie',209,'http://www.revolveclothing.com/nookie-heidi-bodycon-dress-in-black/dp/NKIE-WD97/','#918b8b'),(35,305,'pictures/products/candiceswanepoel_shoess_gianvitorossi_771.jpg','Gianvito Rossi',771,'http://www.neimanmarcus.com/en-pt/Gianvito-Rossi-Patent-Low-Collar-Ankle-Wrap-Pump-Nude/prod183020033/p.prod?ecid=NMALRFeedJ84DHJLQkR4&ci_src=14110925&ci_sku=sku160570186','#ead8cb'),(36,307,'pictures/products/ashleybenson_bags_givenchy_2280.jpg','Givenchy',2280,'http://www.barneys.com/givenchy-antigona-small-duffel-502677154.html','#9f9ea0'),(37,308,'pictures/products/ashleybenson_tops_aeo_34.jpg','American Eagle Outfits',35,'https://ae.com/web/browse/product_details.jsp?productId=1354_6716_600&catId=cat7670003&cid=aeo_aff_709172','#ffc5c4'),(38,266,'pictures/products/gigihaddid_dresses_gucci_3380.jpg','Gucci',3980,'http://www.gucci.com/us/en/pr/women/womens-ready-to-wear/womens-dresses-jumpsuits/chantilly-lace-embroidered-dress-p-414612ZGZ521677','#dec6bf'),(39,233,'pictures/products/bellathorne_dresses_lexia_42.jpg','Lexia',42,'https://www.prettylittlething.com/lexia-rose-gold-plunge-long-sleeve-sequin-skater-dress.html','#e5dfdb'),(41,8,'pictures/products/oliviapalermo_tops_lanvin_623.jpg','Lanvin',623,'http://www.saksfifthavenue.com/main/ProductDetail.jsp?PRODUCT%3C%3Eprd_id=845524446848539&site_refer=SHOP002&prod_id=0400087499775&CA_6C15C=500002830010084907','#f9f7f3'),(42,9,'pictures/products/oliviapalermo_skirts_dolcegabbana_696.jpg','Dolce & Gabbana',696,'http://www.mytheresa.com/en-us/boucle-skirt-447847.html','#949494'),(43,10,'pictures/products/fergie_dresses_victoriabeckham_946.jpg','Victoria Beckham ',946,'http://www.neimanmarcus.com/en-pt/Victoria-Beckham-One-Shoulder-Asymmetric-Seamed-Sheath-Dress-victoria-beckham-one-shoulder/prod180830051___/p.prod?&ecid=NMALRJ84DHJLQkR4&CS_003=5630585','#ee9fc2'),(44,273,'pictures/products/kendalljenner_glasses_concorde_450.jpg','Concorde',450,'http://www.ahlemeyewear.com/products/copy-of-concorde-white-gold','#d1d5be'),(45,274,'pictures/products/kendalljenner_tops_davidkoma_469.jpg','David Koma',469,'http://www.luisaviaroma.com/index.aspx#ItemSrv.ashx|SeasonId=62I&CollectionId=RGY&ItemId=12&SeasonMemoCode=actual&GenderMemoCode=women&CategoryId=&SubLineId=clothing&utm_source=CommissionJunction&utm_medium=affiliation&PID=2178999&AID=10704349','#f9f2e9'),(46,275,'pictures/products/kendalljenner_bags_saintlaurent_790.jpg','Saint Laurent',790,'http://www.net-a-porter.com/pt/en/product/592406/Saint_Laurent/monogramme-bourse-mini-leather-bucket-bag?cm_mmc=LinkshareUS-_-J84DHJLQkR4-_-Custom-_-LinkBuilder&siteID=J84DHJLQkR4-bdhfdl0iHzMZ1Xa8Knn.gw','#b5b5b5'),(47,272,'pictures/products/kendalljenner_pants_Whistles_203.jpg','Whistles',204,'http://www1.bloomingdales.com/shop/product/whistles-ava-slim-leg-pants?ID=1500107','#a5a2a1');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id_tag` int(11) NOT NULL AUTO_INCREMENT,
  `outfit_id` int(11) DEFAULT NULL,
  `garment_id` int(11) DEFAULT NULL,
  `look_url` text,
  `less_url` text,
  `position_x` varchar(5) DEFAULT NULL,
  `position_y` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id_tag`),
  KEY `post_id_idx` (`outfit_id`),
  KEY `garment_id_idx` (`garment_id`),
  CONSTRAINT `garment_id` FOREIGN KEY (`garment_id`) REFERENCES `garments` (`id_garment`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `tags_post_id` FOREIGN KEY (`outfit_id`) REFERENCES `outfits` (`id_outfit`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=359 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,6,1,NULL,'http://us.asos.com/Noisy-May-Biker-Leather-Look-Dress/17r66k/?iid=5680113&r=2&mporgp=L1Byb2Qv','0.555','0.255'),(2,6,2,'http://www.neimanmarcus.com/en-pt/Givenchy-Pandora-Small-Studded-Satchel-Bag-Black-Brown/prod179351007/p.prod','http://www.saksoff5th.com/b-kimora-crossbody-bag/0400087370107.html??site_refer=AFF001&mid=38801&siteID=je6NUbpObpQ-qHDRPQMdAjh4lJLEeqFG4w','0.720','0.534'),(3,6,3,'http://us.puma.com/en_US/pd/puma-by-rihanna-creeper/pna889178080874.html?affID=43737&mktID=AFF:43737:PepperJam:8-9461:USA','http://www.zappos.com/puma-suede-classic-black-white?zlfid=2&PID=6159408&AID=11473432&utm_source=2470763&zpsrc=VigLink&splash=none&zhlfid=208&utm_medium=affiliate&zpch=affiliate','0.530','0.932'),(8,71,5,'http://www.saksfifthavenue.com/main/ProductDetail.jsp?PRODUCT%3C%3Eprd_id=845524446848539&site_refer=SHOP002&prod_id=0400087499775&CA_6C15C=500002830010084907','http://www.shoptiques.com/products/ella-moss-sunburst-pleated-top/122878','0.415','0.323'),(9,71,7,'http://www.mytheresa.com/en-us/boucle-skirt-447847.html','http://www.theoutnet.com/en-US/product/Elizabeth-and-James/Alanis-textured-boucle-tweed-mini-skirt/610203','0.477','0.650'),(10,41,1,'http://www.neimanmarcus.com/en-pt/Victoria-Beckham-One-Shoulder-Asymmetric-Seamed-Sheath-Dress-victoria-beckham-one-shoulder/prod180830051___/p.prod?&ecid=NMALRJ84DHJLQkR4&CS_003=5630585','http://www.lastcall.com/Cut25-by-Yigal-Azrouel-Gathered-One-Shoulder-Dress/prod34080118/p.prod?ecid=LCALRFeed&ncx=n&uEm=%%affiliates%%&ci_src=14110925&ci_sku=sku32580127','0.434','0.545'),(148,36,1,'http://nymag.com/thecut/runway/2016/spring/london/menswear/sibling/15/','http://shop.nordstrom.com/s/eliza-j-stripe-pontea-line-dress/4106680','0.632','0.350'),(149,36,3,'http://www.flightclub.com/nike-ws-air-max-90-sp-sacai-sacai-obsidian-obsidian-black-052568?','http://www.eastbay.com/product/model:203350/sku:99409409/nike-air-max-thea-womens/obsidian/white/&SID=8719','0.831','0.869'),(151,8,1,'https://www.shopbop.com/sleeveless-dress-cushnie-ochs/vp/v=1/1517633209.htm?','http://www.bluefly.com/Jay-Godfrey-black-stretch-crepe-\'Avanti\'-mesh-panel-dress/cat20112/358386201/detail.fly?','0.535','0.269'),(152,11,8,'http://shop.nordstrom.com/s/citizens-of-humanity-racer-whiskered-skinny-jeans-patina/3598968?cm_ven=Linkshare&cm_cat=partner&cm_pla=10&cm_ite=1&siteId=J84DHJLQkR4-oXMko_8yEe7ic0SRwgBRPQ','http://www.saksoff5th.com/medium-wash-super-skinny-jeans/0497114469654.html?site_refer=AFF001&mid=38801&siteID=J84DHJLQkR4-3u2a7oQ17lvlFslmLNXj8w','0.719','0.649'),(153,11,4,'http://www.lanecrawford.com/product/saint-laurent/steel-frame-aviator-sunglasses/_/AQG485/product.lc?utm_source=Linkshare_US&utm_medium=Affiliates&utm_campaign=Accessories&countryCode=US&utm_source=Affiliates&utm_medium=Affiliates&utm_campaign=Linkshare_US&_country=US','http://intl.target.com/p/aviator-sunglasses-gold/-/A-15038088','0.630','0.132'),(154,11,11,'https://eu.rvca.com/','https://www.tillys.com/intl/','0.716','0.243'),(155,10,12,'http://www.farfetch.com/shopping/women/T-By-Alexander-Wang-V-neck-sweater-item-11174346.aspx?fsb=1','http://www.lastcall.com/Neiman-Marcus-Cashmere-Basic-V-Neck-Sweater-Camel/prod34160001/p.prod?','0.420','0.320'),(156,9,4,'http://www.fwrd.com/fw/DisplayProduct.jsp?code=SMCC-WG23&utm_source=shopstyle_us&utm_medium=affiliate&source=shopstyle_us&cvosrc=affiliate.shopstyle_us','http://www.asos.com/es/Gafas-de-sol-redondas-Rine-de-Pieces/cneaj/?iid=5425735&affid=10607&transaction_id=102ee000a1b6e7608dec2f26aa8877&pubref=1023&xr=1&mk=VOID&r=3&mporgp=L1BpZWNlcy9QaWVjZXMtUmluZS1Sb3VuZC1TdW5nbGFzc2VzL1Byb2Qv','0.584','0.087'),(157,9,2,'http://www.neimanmarcus.com/en-pt/Saint-Laurent-Studded-Medium-Bucket-Shoulder-Bag-Black/prod170760061/p.prod?ecid=NMALRJ84DHJLQkR4&CS_003=5630585','http://shop.nordstrom.com/s/urban-originals-rule-breaker-studded-bucket-bag/4148001?cm_ven=Linkshare&cm_cat=partner&cm_pla=10&cm_ite=1&siteId=J84DHJLQkR4-Nje5aHwVwYmNNNZ_wzNmCw','0.336','0.666'),(158,9,8,'http://www.zappos.com/paige-high-rise-bell-canyon-in-joannie-joannie?channel=194&si3299755=&mr:referralID=fe4237ef-a0d2-11e5-a012-005056947d48','http://us.topshop.com/en/tsus/product/clothing-70483/jeans-4593087/tall-moto-black-jamie-flare-jeans-4907242?bi=0&ps=20&geoip=noredirect&network=linkshare&utm_source=linkshare&utm_medium=affiliate&utm_campaign=J84DHJLQkR4&siteID=J84DHJLQkR4-byiYLBhWEmG4Iicz9hcvoQ&cmpid=aff_lsus_J84DHJLQkR4_10&_$ja=tsid:21416|prd:J84DHJLQkR4','0.576','0.783'),(159,9,11,'https://www.modaoperandi.com/anthony-vaccarello-fw15/patchwork-stars-jacket?mid=37385&mid=37385&utm_medium=Linkshare&utm_source=Linkshare&utm_content=J84DHJLQkR4&siteID=J84DHJLQkR4-Z9Y2CkBMZLN_2_T4J5ltTQ','http://www.nastygal.com/clothes/lioness-janis-joplin-moto-jacket?utm_source=linkshare&utm_medium=affiliate&utm_campaign=J84DHJLQkR4&utm_content=J84DHJLQkR4&utm_term=15&siteID=J84DHJLQkR4-SkbjiVge94D7dO3wGBO0aA','0.580','0.339'),(233,88,1,'http://www.luisaviaroma.com/index.aspx#ItemSrv.ashx|SeasonId=62I&CollectionId=CCQ&ItemId=7&SeasonMemoCode=actual&GenderMemoCode=women&SubLineId=clothing','https://www.prettylittlething.com/lexia-rose-gold-plunge-long-sleeve-sequin-skater-dress.html','0.570','0.287'),(266,101,1,'http://www.gucci.com/us/en/pr/women/womens-ready-to-wear/womens-dresses-jumpsuits/chantilly-lace-embroidered-dress-p-414612ZGZ521677','http://www1.bloomingdales.com/shop/product/lucy-paris-semi-sheer-lace-dress?ID=1506853','0.145','0.401'),(272,40,8,'http://www1.bloomingdales.com/shop/product/whistles-ava-slim-leg-pants?ID=1500107&PartnerID=LINKSHARE&cm_mmc=LINKSHARE-_-n-_-n-_-n&PartnerID=LINKSHARE&LinkshareID=J84DHJLQkR4-NRuQOd0ICyoZjrh96_vs7Q','http://www.asos.com/es/Pantalones-de-talle-alto-con-cremalleras-de-ASOS/6n5pb/?iid=3665162&affid=10607&transaction_id=1024f6d34a6b0c87796a0fd3f4ac0c&pubref=1023&xr=1&mk=VOID&r=3&mporgp=L2Fzb3MvYXNvcy1oaWdoLXdhaXN0LXRyb3VzZXJzLXdpdGgtemlwcy9wcm9kLw..','0.414','0.740'),(273,40,4,'http://www.ahlemeyewear.com/products/copy-of-concorde-white-gold','http://shop.nordstrom.com/s/polaroid-eyewear-1010sm-57mm-polarized-navigator-sunglasses/4051917?cm_ven=Linkshare&cm_cat=partner&cm_pla=10&cm_ite=1&siteId=J84DHJLQkR4-jnXwf.lnzDES0ewyQzrPuQ','0.290','0.128'),(274,40,5,'http://www.luisaviaroma.com/index.aspx#ItemSrv.ashx|SeasonId=62I&CollectionId=RGY&ItemId=12&SeasonMemoCode=actual&GenderMemoCode=women&CategoryId=&SubLineId=clothing&utm_source=CommissionJunction&utm_medium=affiliation&PID=2178999&AID=10704349','http://us.asos.com/ASOS-Top-In-Crepe-With-Bell-Sleeve/161amy/?iid=5085752&istCompanyId=467dd896-9a62-42c2-84d9-be2d13921f66&istItemId=rriamwxwp&istBid=t&transaction_id=10272cdf28154a9b924ded8b4192f6&affid=10607&r=2&mporgp=L1Byb2Qv','0.260','0.293'),(275,40,2,'http://www.net-a-porter.com/pt/en/product/592406/Saint_Laurent/monogramme-bourse-mini-leather-bucket-bag?cm_mmc=LinkshareUS-_-J84DHJLQkR4-_-Custom-_-LinkBuilder&siteID=J84DHJLQkR4-bdhfdl0iHzMZ1Xa8Knn.gw','http://www.barneyswarehouse.com/Deux-Lux-Elle-Medium-Bucket-Bag-504057764.html?utm_source=J84DHJLQkR4&utm_medium=affiliate&siteID=J84DHJLQkR4-1sDG7.xqlHQR3URGvcdvYA','0.175','0.701'),(276,7,4,'http://www.lanecrawford.com/linkshare/?countryCode=US&mid=38298&siteID=je6NUbpObpQ-LwuhAB2lvhB7F3PUOXFfFg&url=http%3A%2F%2Fwww.lanecrawford.com%2Fproduct%2Fsaint-laurent%2Fsteel-frame-aviator-sunglasses%2F_%2FAQG485%2Fproduct.lc%3F%3FcountryCode%3DUS%26utm_source%3DAffiliates%26utm_medium%3DAffiliates%26utm_campaign%3DLinkshare_US','http://www.target.com/p/aviator-sunglasses-gold/-/A-15038088?','0.554','0.171'),(277,7,5,NULL,'http://www.theoutnet.com/en-US/product/ENZA-COSTA/Ribbed-jersey-tank/611018?cm_mmc=LinkshareUK-_-je6NUbpObpQ-_-Custom-_-LinkBuilder&siteID=je6NUbpObpQ-qbslJuf4EXUS88hmYGqbQA','0.538','0.263'),(278,7,3,'http://www.mytheresa.com/en-us/cassell-lace-up-boots.html','http://eu.topshop.com/webapp/wcs/stores/servlet/ProductDisplay?searchTermScope=3&searchType=ALL&viewAllFlag=false&beginIndex=1&langId=-1&productId=20768449&pageSize=20&searchTerm=TS32H21ITAN&catalogId=34058&productIdentifierproduct=product&geoip=search&x=25&searchTermOperator=LIKE&sort_field=Relevance&y=11&storeId=13058&qubitRefinements=siteId%3DTopShopEU','0.560','0.871'),(279,7,6,'http://www.blueandcream.com/TREND_DESTROYED_W/RTAS5-7.html?ref=cj&utm_source=CJ&utm_medium=affiliate&utm_campaign=CJ','https://www.thedreslyn.com/rta-river-zipper-cut-off-shorts.html?source=pepperjam&publisherId=43737&clickId=1406580952','0.425','0.473'),(280,12,9,'https://www.rolandmouret.com/product/FINCHES-JUMPSUIT-4420','http://www.houseoffraser.co.uk/Tommy+Hilfiger+Dareece+Jumpsuit/223839925,default,pd.html','0.699','0.543'),(281,12,1,'','','0.306','0.481'),(303,111,11,'https://www.modaoperandi.com/wes-gordon-ss15/single-breasted-belted-trench-coat??mid=37385&utm_medium=Linkshare&utm_source=Linkshare&utm_content=J84DHJLQkR4&siteID=J84DHJLQkR4-Hc68mYbISxThvUK.I1xnZQ','','0.599','0.208'),(304,111,1,'http://www.revolveclothing.com/nookie-heidi-bodycon-dress-in-black/dp/NKIE-WD97/?d=F&sectionURL=http%3A%2F%2Fapi.shopstyle.com%2Faction%2FapiVisitRetailer%3Fid%3D502734789%26pid%3Duid5025-692255-74','','0.461','0.296'),(305,111,3,'http://www.neimanmarcus.com/en-pt/Gianvito-Rossi-Patent-Low-Collar-Ankle-Wrap-Pump-Nude/prod183020033/p.prod?ecid=NMALRFeedJ84DHJLQkR4&ci_src=14110925&ci_sku=sku160570186','','0.473','0.915'),(307,104,2,'http://www.barneys.com/givenchy-antigona-small-duffel-502677154.html?utm_medium=affiliate&siteID=Z77QPydcorE-40iko.dLBZjXUYcRFqat5A&utm_source=Z77QPydcorE','','0.742','0.462'),(308,104,11,'https://ae.com/web/browse/product_details.jsp?productId=1354_6716_600&catId=cat7670003&cid=aeo_aff_709172','','0.356','0.445'),(310,112,5,'http://www.shopstyle.com/g/women/david-koma/frilled-sleeve-sweater','','0.341','0.251'),(311,112,7,'http://www.bergdorfgoodman.com/David-Koma-Two-Tone-Sleeveless-Open-Back-Top-Wool-Midi-Skirt-w-Leather-Pockets/prod112170041_cat441206__/p.prod?ecid=BGALRZ77QPydcorE','','0.561','0.486'),(318,119,4,'http://www.revolveclothing.com/rayban-metal-flash-lense-aviator-in-matte-gold-orange-flash/dp/RAYB-UG6/?d=U&currency=USD&utm_campaign=57486&utm_medium=affiliate&source=ir&utm_source=ir','','0.663','0.108'),(319,119,1,'http://www.selfridges.com/GB/en/cat/self-portrait-militaire-crepe-maxi-dress_234-3003847-SP8006/?previewAttribute=Camel&previewSize=14&_$ja=tsid:32619%7Cprd:202819&cm_mmc=AFFIL-_-AWIN-_-202819-_-0RpXOIXA500&awc=3539_1450068406_abd23d325911a260f2f4690b19175dc4&utm_source=Affiliates&utm_medium=202819&utm_term=na&utm_content=na&utm_campaign=na','','0.615','0.328'),(320,119,3,'http://www.kurtgeiger.us/britton-nude-leather-patent-39-kurt-geiger-london-shoe.html?','','0.445','0.841'),(321,119,11,'','https://www.missguidedus.com/new-in/back-in-stock/oversized-wool-coat-camel-camel?utm_source=LinkshareUS&utm_medium=affiliates&utm_campaign=J84DHJLQkR4','0.339','0.327'),(323,120,4,'https://www.shopbop.com/deep-freeze-sunglasses-karen-walker/vp/v=1/1556627792.htm?folderID=2534374302024641&os=false&colorId=12867&extid=affprg_CJ_SB_US-7900573-ShopStyle&cvosrc=affiliate.cj.7900573','','0.584','0.135'),(324,120,12,'http://www.polyvore.com/nili_lotan_aran_cashmere_turtleneck/thing?id=152952500','','0.358','0.241'),(325,120,7,'http://www.farfetch.com/pt/shopping/women/item11235700.aspx?q=11235700','','0.383','0.487'),(326,120,3,'http://www.saksfifthavenue.com/main/ProductDetail.jsp?PRODUCT%3C%3Eprd_id=845524446602284&site_refer=BZR002&prod_id=0442290518085&szredirectid=14500739350154970814710040302008005&CA_6C15C=500002830000354955','','0.516','0.901'),(331,121,11,'http://www.revolveclothing.com/elizabeth-and-james-hart-tibetan-lamb-fur-coat-in-nude/dp/EAND-WO201/?d=F&currency=USD&utm_campaign=57486&utm_medium=affiliate&source=ir&utm_source=ir','','0.326','0.238'),(332,121,3,'https://www.therealreal.com/products/women/shoes/sneakers/saint-laurent-sneakers-52?sid=ncvyyf&cvosrc=affiliate.shareasale.595441','','0.556','0.913'),(353,123,2,'http://www.barneys.com/Fendi-Peekaboo-Large-Satchel-504220532.html?utm_source=J84DHJLQkR4&utm_medium=affiliate&siteID=J84DHJLQkR4-6MQkBhcyUqnwljuhNlVsFg','','0.307','0.549'),(354,122,4,'http://www.barneys.com/Dita-Condor-Two-Aviator-Sunglasses-503410036.html?utm_source=J84DHJLQkR4&utm_medium=affiliate&siteID=J84DHJLQkR4-jBCk.AYvJPoKPnwsBjG0Bg','','0.584','0.105'),(355,122,NULL,'http://www.saksfifthavenue.com/main/ProductDetail.jsp?PRODUCT%3C%3Eprd_id=845524446879196&site_refer=&site_refer=AFF001&mid=13816&siteID=J84DHJLQkR4-a06TKEM8WtAGyMb2x134WQ&LSoid=408965&LSlinkid=15&LScreativeid=400088179074','','0.323','0.182'),(356,122,3,'http://www.barneys.com/adidas-Originals-by-Kanye-West-YEEZY-SEASON-1-Women\'s-Yeezy-950-Boots-504325158.html?utm_source=J84DHJLQkR4&utm_medium=affiliate&siteID=J84DHJLQkR4-pxizHrtqIkFuTauq2lK3Og','','0.511','0.847'),(357,122,2,'http://www.farfetch.com/shopping/women/Hermes-Vintage-Kelly-tote-item-11119546.aspx?fsb=1','','0.640','0.702');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `fullname` varchar(60) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT 'img/USER.svg',
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (25,'gjoforte@gmail.com','gjoforte','$2a$10$frWOqpiD2UyzkI.U03wjBuMnlOREB5AKLM9sJmxPPYMYzLB929u6C','Gonçalo Forte','uploads/goncaloforte.jpg'),(26,'test@r3born.pt','reborn','$2a$10$ZQruKUGx5jbKSoPf6zaZw.Pa7IQLzwR8Ti9HLOyETRoMOn48LC2TC','R3born Interactive','pictures/users/r3born.png'),(27,'admin@r3born.pt','admin','$2a$10$6NBvYcaSfFo13e.A9dyXRuOhr5VWRPKx0dGMEvsRycOuFvhk5jK/2','Admin','img/USER.svg'),(29,'mail@example.com','user','$2a$10$HAfnvW5irb.Nr2YfOaWjyOvEeTTwnCu9tE8wfHg.5VdT.yGJy.Is2',NULL,NULL),(30,'email@mail.com','name','$2a$10$SerjKVpx.WKjru6OVE.M0e7CyNTl7WRG3EcCsycznlpeeY0BrrzR6',NULL,NULL),(32,'rrrrr@ss.pl','ddff@sss.pl','$2a$10$5kmew1F3cGPjHwtJakNIteOxGAS1OqI6Mu8xhbUh51XYUvT9YO52y',NULL,NULL),(36,'qwqw@zzzzzzz.pl','a','$2a$10$KUr2o2PDRZfjpN.FFAdg1.dElZPwyf6b0K7zB12ZSF6mGb19bXq8C',NULL,NULL),(37,NULL,'test_username','$2a$10$KRqcIZyjB0o379FHkIaQCuO6NLlohKeKzOP5Qhr6gTp4NpxnOBiRa',NULL,'img/USER.svg'),(44,'aaa@aaa.pl','aaa','$2a$10$BBWY2lsJInrOoAdgRxQaaOBMT8skP73KYWmMAWU4hr6ucbX0z57ne',NULL,'img/USER.svg'),(45,'asd@asd.com','asdf','$2a$10$U5l/mKJ5zTFiUJXXvjP5guym1abd393hx3tj/EQI9lSTJqIrtjiI6',NULL,'img/USER.svg'),(46,'tiago@r3born.com','tiago','$2a$10$WuufPSm4oRNx.yIMibHH7.Uf3YggxkeL.bkre9JCjJezwQ1JGv04S','Tiago Costa','uploads/screen2.jpg'),(47,'joao@r3born.pt','Jonny','$2a$10$UA8re1hNYDBQQsBntaRrR.Fj.wKe/BuM8xxZLcnBpJetKKOQi1LXi','Joao','uploads/Screen Shot 2015-11-23 at 19.59.52.png'),(48,'dianaicsimoes@gmail.com','di','$2a$10$jSLDIEJ5rR7F3.mPG/b4reEU6Jh50joZ/HeCpoMvP/GQO77e567Nu',NULL,'img/USER.svg'),(50,'asdfg','asdfg','$2a$10$Q7o9YX8iMMBEzkd/polwjeVQEnvcZS8C8xqxycxPgFKu6aTQng3Vu',NULL,'img/USER.svg'),(52,'tiago@reborn.pt','tiago1','$2a$10$jbSVFb5qGnscnY.9ey8TruhnrwH2v5VhNsPeBVmwYe0Dvn2JVLBzi',NULL,'img/USER.svg'),(53,'aa@awsw.pl','aa','$2a$10$DXcrsCFHZY.Ydy9Y0oIfCOD4YRCCDIZ0IKgKD2gNqmyWq.0iYDI0a',NULL,'img/USER.svg'),(55,'aa@awsw.com','aaaaw','$2a$10$aE4tVoEcKGoZte.jOQPRnukxgs1nkdf1gz2OfGg2/iQ6xtCA.nRo6',NULL,'img/USER.svg'),(56,'a@a.pl','nnnnrrrrrr','$2a$10$GHhdG1HZu285GLFCRI0eQOB/4PGe3nxLxNa0V4smCVHY.JgCXrS3i',NULL,'img/USER.svg'),(58,'eeeeeeeeee','b@a.pl','$2a$10$ehPkDhowDDvb7mfaWL/jneAcp011OPsImggIguZ4KqPz1wAFB2S06',NULL,'img/USER.svg'),(59,'tttt','c@a.pl','$2a$10$5wCVRhTQOgQGuy.coYA.KOLEzDna1Zw/fne5R8inYla3TT9/mrnn2',NULL,'img/USER.svg'),(60,'b@a.pl','frfrfr','$2a$10$1e4rw44EGKfJDpyG3/abKOrSP6C9oFsM6CZFiOOFw4YLCBMDz8ZlW',NULL,'img/USER.svg'),(62,'test@test.com','test_user','$2a$10$mVaaEi.Y9cxsCqt/hWPRtuAM9R0vMGGTq/UPO6392/aKs6wI4L2HS',NULL,'img/USER.svg'),(67,'c@x.pl','michal','$2a$10$cUMtoJ8zhpe15e2cfYAxeeBuBDYawnd4l.8UADTNznkL4UTnsEhwq',NULL,'img/USER.svg'),(69,'cbbbb.','michalnn','$2a$10$f8ERw0PYqa7eBCj4uIRz2.kNy.p25DT5A7xwcxCfv5G8Mp5KUu2PS',NULL,'img/USER.svg'),(74,'sonle@ulab.com','sonle','$2a$10$r76mQxlQPSlO4pYHGwI6X.wjy7P7HQHQo4PZS3ZSmbfe3jSiQJK8e',NULL,'img/USER.svg'),(78,'a@a.po','ab','$2a$10$wmJARCEj4U7Vg2IjiF/.Uu2ekUyd1.DhW8rLUVQoa2G/Z5nZjrD.S',NULL,'img/USER.svg'),(79,'lukasz.sokolowski@infullmobile.com','Sokol QA','$2a$10$uM43tiVYLVcANm4Juu9kAOQ0NUDuRZIp8hLsQmO/ad4meAC0n5nLO',NULL,'img/USER.svg'),(81,'nowy@mail.com','nowy@mail.com','$2a$10$vBmiMDIRSgZF.kVb/bEzYe9OLoc58/Hk1AN995Za8beM5VSnVUuZ.',NULL,'img/USER.svg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `alloutfits`
--

/*!50001 DROP VIEW IF EXISTS `alloutfits`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `alloutfits` AS select `o`.`id_outfit` AS `id_outfit`,`o`.`celebrity_id` AS `celebrity_id`,`o`.`image_url` AS `image_url`,`o`.`description` AS `description`,`o`.`date` AS `date`,`c`.`id_celebrity` AS `id_celebrity`,`c`.`celebrity` AS `celebrity`,`c`.`thumbnail_url` AS `thumbnail_url`,`c`.`picture_url` AS `picture_url`,(select count(0) from `favourites` `f` where (`o`.`id_outfit` = `f`.`outfit_id`)) AS `favourites`,(select count(0) from `following` `g` where (`c`.`id_celebrity` = `g`.`celebrity_id`)) AS `following` from (`outfits` `o` join `celebrities` `c`) where (`c`.`id_celebrity` = `o`.`celebrity_id`) order by `o`.`date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-01-04 15:44:57
