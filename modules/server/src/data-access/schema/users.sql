CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL,
  `passwordHash` varchar(256) NOT NULL,
  `passwordSalt` varchar(256) NOT NULL,
  `playerId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `playerId_UNIQUE` (`playerId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
