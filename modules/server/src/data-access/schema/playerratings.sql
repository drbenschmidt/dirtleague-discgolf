CREATE TABLE `playerratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `playerId` int NOT NULL,
  `cardId` int NOT NULL,
  `date` datetime NOT NULL,
  `rating` int NOT NULL,
  `type` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
