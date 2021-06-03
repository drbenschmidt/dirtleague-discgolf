CREATE TABLE `playergroupresults` (
  `playerGroupId` int NOT NULL,
  `courseHoleId` int NOT NULL,
  `score` int DEFAULT NULL,
  PRIMARY KEY (`playerGroupId`,`courseHoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
