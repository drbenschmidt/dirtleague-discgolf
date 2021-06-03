CREATE TABLE `courseholes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseLayoutId` int NOT NULL,
  `number` int NOT NULL,
  `distance` int NOT NULL,
  `par` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_courseLayout_idx` (`courseLayoutId`),
  CONSTRAINT `fk_courseLayout` FOREIGN KEY (`courseLayoutId`) REFERENCES `courselayouts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
