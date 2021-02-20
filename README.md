# dirtleague-discgolf
Disc golf web app for managing players, tournaments, and seasons.

This is a monorepo with a react client and express/mysql backend.

The general idea is that people can sign up and participate in events/tournaments. The events will be part of a season, and the participants of each event in the season will have their player rating calculated after each event.

Events can consist of multiple rounds. Scorecards from UDisc can be uploaded and will be mapped to a player based on a players aliases. For example, a user named Kyle could also go as Deal Kid, DK, Back 9 Kyle, etc.

To install, run
```
yarn
```
in the repo root, and to start run
```
yarn start
```
which will start the backend service and frontend react dev server.

A docker compose file would be nice to have to have a mysql server and two node containers started up.