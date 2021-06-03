CREATE TABLE `rounds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eventId` int DEFAULT NULL,
  `courseId` int NOT NULL,
  `courseLayoutId` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `isComplete` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_events_idx` (`eventId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
