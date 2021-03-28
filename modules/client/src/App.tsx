import 'semantic-ui-css/semantic.min.css';
import { useState, useEffect, memo } from 'react';
import useOnce from './hooks/useOnce';
import AuthContext from './components/auth/context';
import RepositoryContext from './data-access/context';
import AuthManager from './managers/auth';
import ApiFetch from './data-access/api-fetch';
import Router from './router';
import RepositoryServices from './data-access/repository-services';

const App = () => {
  const apiFetch = useOnce(() => ApiFetch.CreateFromLocalStorage());
  const authManager = useOnce(() => new AuthManager(apiFetch));
  const repositoryServices = useOnce(
    () => new RepositoryServices({ api: apiFetch })
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const doWork = async () => {
      await authManager.getIsAuthenticated();
      setIsLoaded(true);
    };

    doWork();
  }, [authManager]);

  if (!isLoaded) {
    // TODO: Show loading screen.
    return null;
  }

  return (
    <RepositoryContext.Provider value={repositoryServices}>
      <AuthContext.Provider value={authManager}>
        <Router />
      </AuthContext.Provider>
    </RepositoryContext.Provider>
  );
};

export default memo(App);
