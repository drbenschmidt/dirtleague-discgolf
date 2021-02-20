ERD type thing

| Entity | Description | Relationships |
| ------ | ----------- | ------------- |
| User | Used to interact with the system | none |
| Profile | Contains information about the disc golfers | `Events`, `Cards` |
| Course | Contains information about courses used for events | `Events` |
| Event | An event that contained some form of rounds played | `Rounds` |
| Round | An actual disc golf round. Can be singles or doubles | `Cards` |
| Card | The result of a round for a person or team | `Profiles`, `Round` |
| Season | A collection of events that become a League Season. Used for player ratings and standings. | `Profiles`, `Events` |