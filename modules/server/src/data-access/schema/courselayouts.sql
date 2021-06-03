CREATE TABLE `courselayouts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int NOT NULL,
  `name` varchar(256) NOT NULL,
  `dgcrSse` double DEFAULT NULL,
  `par` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_courses_idx` (`courseId`),
  CONSTRAINT `fk_courses` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
