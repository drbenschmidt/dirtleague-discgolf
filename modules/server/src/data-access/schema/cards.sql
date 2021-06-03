CREATE TABLE `cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roundId` int NOT NULL,
  `authorId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
