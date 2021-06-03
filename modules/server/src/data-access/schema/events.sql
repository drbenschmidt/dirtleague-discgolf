CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seasonId` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `description` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
