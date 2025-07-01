/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 10.4.32-MariaDB : Database - projectmdp
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`projectmdp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `projectmdp`;

/*Table structure for table `campaigns` */

DROP TABLE IF EXISTS `campaigns`;

CREATE TABLE `campaigns` (
  `campaign_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `target_amount` int(11) DEFAULT NULL,
  `current_amount` int(11) DEFAULT NULL,
  `status` enum('pending','active','completed','cancelled') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`campaign_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `campaigns_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `campaigns` */

insert  into `campaigns`(`campaign_id`,`user_id`,`title`,`description`,`image_url`,`target_amount`,`current_amount`,`status`,`createdAt`,`updatedAt`,`deletedAt`) values 
('CAM001','US003','Campaign 1','Campaign 1 description','https://via.placeholder.com/150',1000000,30000,'active','2025-06-25 12:01:24','2025-06-25 13:49:06',NULL),
('CAM002','US003','Campaign 2','Campaign 2 description','https://via.placeholder.com/150',1000000,0,'active','2025-06-25 12:01:24','2025-06-25 12:01:24',NULL),
('CAM003','US003','Campaign 3','Campaign 3 description','https://via.placeholder.com/150',1000000,1000000,'completed','2025-06-25 12:01:24','2025-06-25 12:01:24',NULL);

/*Table structure for table `disbursements` */

DROP TABLE IF EXISTS `disbursements`;

CREATE TABLE `disbursements` (
  `disbursement_id` varchar(255) NOT NULL,
  `campaign_id` varchar(255) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `status` enum('pending','approved','rejected','processing') DEFAULT NULL,
  `request_at` datetime NOT NULL,
  `processed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`disbursement_id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `disbursements_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `disbursements` */

insert  into `disbursements`(`disbursement_id`,`campaign_id`,`amount`,`status`,`request_at`,`processed_at`) values 
('DIS001','CAM003',100000,'approved','2025-06-25 12:07:48','2025-06-25 12:07:48');

/*Table structure for table `donations` */

DROP TABLE IF EXISTS `donations`;

CREATE TABLE `donations` (
  `donation_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `campaign_id` varchar(255) NOT NULL,
  `is_anonymous` tinyint(1) NOT NULL,
  `amount` int(11) NOT NULL,
  `status` enum('pending','success','failed') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`donation_id`),
  KEY `user_id` (`user_id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `donations_ibfk_2` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `donations` */

insert  into `donations`(`donation_id`,`user_id`,`campaign_id`,`is_anonymous`,`amount`,`status`,`createdAt`,`updatedAt`,`deletedAt`) values 
('DON001','US001','CAM002',0,30000,'success','2025-06-25 12:06:08','2025-06-25 12:06:08',NULL),
('DON002','US002','CAM002',1,30000,'success','2025-06-25 12:06:08','2025-06-25 12:06:08',NULL),
('DON003','US004','CAM003',1,100000,'success','2025-06-25 12:06:08','2025-06-25 12:06:08',NULL),
('DON004','US006','CAM001',0,30000,'success','2025-06-25 13:49:06','2025-06-25 13:49:06',NULL);

/*Table structure for table `sequelizemeta` */

DROP TABLE IF EXISTS `sequelizemeta`;

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `sequelizemeta` */

insert  into `sequelizemeta`(`name`) values 
('20250625112443-create-user.js'),
('20250625113824-create-donation.js'),
('20250625114351-create-campaign.js'),
('20250625114758-create-disbursement.js');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','donatur','fundraiser') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`user_id`,`firstName`,`lastName`,`email`,`password`,`role`,`createdAt`,`updatedAt`,`deletedAt`) values 
('US001','John','Doe','john.doe@example.com','$2a$12$Zw3PoeCK/gAE7fTliVG8BuuTWhiaJjtOGykJdLF1PuOr4qK9seOyy','donatur','2025-06-25 11:58:13','2025-06-25 11:58:13',NULL),
('US002','Jane','Smith','jane.smith@example.com','$2a$12$Zw3PoeCK/gAE7fTliVG8BuuTWhiaJjtOGykJdLF1PuOr4qK9seOyy','donatur','2025-06-25 11:58:13','2025-06-25 11:58:13',NULL),
('US003','Jim','Beam','jim.beam@example.com','$2a$12$Zw3PoeCK/gAE7fTliVG8BuuTWhiaJjtOGykJdLF1PuOr4qK9seOyy','fundraiser','2025-06-25 11:58:13','2025-06-25 11:58:13',NULL),
('US004','Sarah','Mccarthy','sarah.mccarthy@example.com','$2a$12$Zw3PoeCK/gAE7fTliVG8BuuTWhiaJjtOGykJdLF1PuOr4qK9seOyy','donatur','2025-06-25 11:58:13','2025-06-25 11:58:13',NULL),
('US005','Admin','Admin','admin@example.com','$2a$12$Zw3PoeCK/gAE7fTliVG8BuuTWhiaJjtOGykJdLF1PuOr4qK9seOyy','admin','2025-06-25 11:58:13','2025-06-25 11:58:13',NULL),
('US006','Reza','Pratama','reza@gmail.com','$2b$12$BZx5WB8ik63P0HAbCjrhDOjgL1YyInlRBFomo/AGQ90xIs78dqJwW','donatur','2025-06-25 12:47:43','2025-06-25 12:47:43',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
