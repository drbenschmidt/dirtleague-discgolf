## Notes
For authentication, we should follow [this example](https://github.com/expressjs/express/blob/master/examples/auth/index.js)

Add a config handler to gather configs from env vars and a config.json file. Merge them together.

It would be sweet to move this over to typescript, I just haven't gotten that far yet as it's extra work.

## Entity Relationships and Descriptions
Note: I still need to make sure this is roughly what we want.

| Entity | Description | Relationships |
| ------ | ----------- | ------------- |
| User | Used to interact with the system | none |
| Profile | Contains information about the disc golfers | `Events`, `Cards` |
| Course | Contains information about courses used for events | `Events` |
| Event | An event that contained some form of rounds played | `Rounds` |
| Round | An actual disc golf round. Can be singles or doubles | `Cards` |
| Card | The result of a round for a person or team | `Profiles`, `Round` |
| Season | A collection of events that become a League Season. Used for player ratings and standings. | `Profiles`, `Events` |