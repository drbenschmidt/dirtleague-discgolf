import type ApiFetch from './api-fetch';
import PlayerRepository from './repositories/player';
import AliasRepository from './repositories/alias';

interface RepositoryServicesProps {
  api: ApiFetch;
}

class RepositoryServices {
  api: ApiFetch;

  players: PlayerRepository;

  aliases: AliasRepository;

  constructor(props: RepositoryServicesProps) {
    const { api } = props;

    this.api = api;
    this.players = new PlayerRepository(this.api);
    this.aliases = new AliasRepository(this.api);
  }
}

export default RepositoryServices;
