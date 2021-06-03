CREATE TABLE `playergroupplayers` (
  `playerGroupId` int NOT NULL,
  `playerId` int NOT NULL,
  PRIMARY KEY (`playerId`,`playerGroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
