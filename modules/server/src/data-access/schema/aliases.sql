CREATE TABLE `aliases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `playerId` int NOT NULL,
  `value` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
