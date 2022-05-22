-- Adminer 4.8.0 MySQL 8.0.23 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE TABLE `anime` (
  `animeId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `userId` int NOT NULL,
  `imgUrl` varchar(500) NOT NULL,
  PRIMARY KEY (`animeId`),
  KEY `userId` (`userId`),
  CONSTRAINT `anime_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `anime` (`animeId`, `title`, `userId`, `imgUrl`) VALUES
(3,	'Fruits Basket',	1,	'https://cdn.myanimelist.net/images/anime/4/75204t.jpg'),
(5,	'Bleach',	3,	'https://cdn.myanimelist.net/images/anime/3/40451t.jpg'),
(7,	'Spy x Family',	1,	'https://cdn.myanimelist.net/images/anime/1441/122795t.jpg'),
(8,	'Mahou Shoujo Madoka★Magica',	4,	'https://cdn.myanimelist.net/images/anime/11/55225t.jpg'),
(11,	'Hunter x Hunter (2011)',	4,	'https://cdn.myanimelist.net/images/anime/1337/99013t.jpg'),
(12,	'Spy x Family',	3,	'https://cdn.myanimelist.net/images/anime/1441/122795t.jpg'),
(14,	'Spy x Family',	8,	'https://cdn.myanimelist.net/images/anime/1441/122795t.jpg'),
(15,	'Fullmetal Alchemist: Brotherhood',	11,	'https://cdn.myanimelist.net/images/anime/1223/96541t.jpg'),
(16,	'Spy x Family',	12,	'https://cdn.myanimelist.net/images/anime/1441/122795t.jpg'),
(17,	'JoJo no Kimyou na Bouken (TV)',	13,	'https://cdn.myanimelist.net/images/anime/3/40409t.jpg'),
(19,	'Fullmetal Alchemist: Brotherhood',	15,	'https://cdn.myanimelist.net/images/anime/1223/96541t.jpg'),
(24,	'Hori-san to Miyamura-kun',	1,	'https://cdn.myanimelist.net/images/anime/2/40175t.jpg');

CREATE TABLE `reviews` (
  `reviewId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `description` varchar(250) NOT NULL,
  `rating` int NOT NULL,
  `title` varchar(60) NOT NULL,
  PRIMARY KEY (`reviewId`),
  KEY `userId` (`userId`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `reviews` (`reviewId`, `userId`, `description`, `rating`, `title`) VALUES
(1,	4,	'Test review',	4,	'Vivy: Fluorite Eye\'s Song'),
(2,	4,	'Another test review',	5,	'Spy x Family'),
(3,	6,	'Yet another test!!!!!',	2,	'Hametsu no Mars'),
(4,	1,	'It was a super interesting show and a lot of action!        ',	5,	'Attack on Titan'),
(5,	3,	'Wow, very epic!',	5,	'Bleach'),
(6,	11,	'I love how tig the biddies are. It\'s hella lit. Story was meh.',	5,	'Sword Art Online'),
(7,	15,	'  Great Show!            ',	5,	'HunterXHunter'),
(9,	1,	'Super good show! It\'s so funny.      ',	5,	'Spy X Family');

CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `password` varchar(72) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`userId`, `username`, `firstName`, `lastName`, `password`) VALUES
(1,	'stephy',	'Steph',	'H',	'$2b$10$bTlJpDybVX/ng6poY4xETOwafahs5iwdgex63okhfHXyifMBpHW0W'),
(2,	'kary',	'Kary',	'H',	'$2b$10$M1sfgDbfxG96iQYD5aiGC.4fpMEKV37np0nByAwSgVDYplK1etUjG'),
(3,	'deeglo',	'Dylan',	'I',	'$2b$10$DBbli.qafq/lZk.iFVQ4oOxa/nvndmhEmgbIoyTMlgIMlpYul4gYi'),
(4,	'chrisl',	'Chris',	'L',	'$2b$10$RQQ1/eC0gyGOK8kAdEN7v.oyjdWKPrkeDJlL75WJD2nZYx56buuNG'),
(5,	'myMelody',	'Mel',	'Ne',	'$2b$10$fKVvXgwt5zaVJ5WXWU4Cu.YZZHfJIsnCPsrXoxIxMwOK3Vtmtu5R2'),
(6,	'altAccount',	'c',	'l',	'$2b$10$nWmIqlJmV2VytA9LBc4pNO/nLkvEOnDRX68YNlI5Q1o3.S7zv5KSm'),
(7,	'villaleobos',	'Leo',	'V',	'$2b$10$LiyQIAzK14v1jFpaCW6DgucPlirMtW7IdGJYrSA2toLFsxnE0vEVe'),
(8,	'animefan',	'anna',	'mae',	'$2b$10$KNaMxk6NhT2ONr3UfqP8X.UuQLUiwetJxgw9KVD3e2K.xmuc7p68O'),
(9,	'NAPF',	'Nicolas',	'PF',	'$2b$10$ToZM.yNbf8P7ucsd4UfRX./0OKJV/QEL9SgJHSvYrss9pFOoyX2ZG'),
(10,	'Justin',	'Justin',	'D',	'$2b$10$HrXjtbvfFAM4hv7XA4rb1e0TIIZk/BFlxkvuWLvpOISXyidKKthsi'),
(11,	'tigbiddies',	'Eren',	'Yayayayager',	'$2b$10$sU.23eKyeZJntzA.TDkwh.6JLSF0fJDBH/wEp5jXtsIIQtvEV1.B.'),
(12,	'user',	'user',	'user',	'$2b$10$/X9QIGThBl.L/DQ2NRKBX.VaP07M75JyJPcwkRfOFedBtjqMheWuq'),
(13,	'abemin',	'Abe',	'Rob',	'$2b$10$OdxaYSW3bvZoUqlCumrWpO5YQ2OwOhj.KNK7oaAPEJcmEmVV8lfNS'),
(14,	'3',	'3',	'3',	'$2b$10$yJTMTs//0ay8yKFicpt3FurveN0DmCWN5TTCghu2ooPf24dKL5Ahy'),
(15,	'Test',	'Joe',	'Smith',	'$2b$10$.cEaBO01wUzV9y4jv0nNiuvs2PqRZryb.P67/.BF//JKv.qvhuV4e');

-- 2022-05-22 19:51:41
