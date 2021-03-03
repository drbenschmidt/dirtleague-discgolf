import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createAliasesTable = async (db: ConnectionPool): Promise<void> => {
  await db.query(sql`
    CREATE TABLE IT NOT EXISTS aliases (
      id INT NOT NULL AUTO_INCREMENT,
      playerId INT NOT NULL,
      value VARCHAR(45) NOT NULL,
      PRIMARY KEY (id));
  `);
};

/**
 * ALTER TABLE `test-db`.`aliases` 
ADD INDEX `playerIdIndex` USING BTREE (`id`, `playerId`);
;
 */

/**
 * ALTER TABLE `test-db`.`profiles` 
ADD CONSTRAINT `fk_aliases`
  FOREIGN KEY (`id`)
  REFERENCES `test-db`.`aliases` (`playerId`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

 */
