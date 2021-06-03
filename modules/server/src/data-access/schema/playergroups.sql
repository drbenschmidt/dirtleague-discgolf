CREATE TABLE `playergroups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cardId` int NOT NULL,
  `teamName` varchar(128) DEFAULT NULL,
  `score` int DEFAULT NULL,
  `par` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
