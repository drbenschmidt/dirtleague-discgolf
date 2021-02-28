import type ApiFetch from './api-fetch';
import ProfileRepository from './repositories/profile';
import AliasRepository from './repositories/alias';

interface RepositoryServicesProps {
  api: ApiFetch;
}

class RepositoryServices {
  api: ApiFetch;

  profiles: ProfileRepository;

  aliases: AliasRepository;

  constructor(props: RepositoryServicesProps) {
    const { api } = props;

    this.api = api;
    this.profiles = new ProfileRepository(this.api);
    this.aliases = new AliasRepository(this.api);
  }
}

export default RepositoryServices;
