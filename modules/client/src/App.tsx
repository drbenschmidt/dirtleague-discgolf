import 'semantic-ui-css/semantic.min.css';
import React, { useState, useEffect } from 'react';
import useOnce from './hooks/useOnce';
import AuthContext from './components/auth/context';
import AuthManager from './managers/auth';
import { ApiFetch } from './data-access/repositories';
import Router from './router';

const App = () => {
  const apiFetch = useOnce(() => ApiFetch.CreateFromLocalStorage());
  const authManager = useOnce(() => new AuthManager(apiFetch));
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
    <AuthContext.Provider value={authManager}>
      <Router />
    </AuthContext.Provider>
  )
};

export default React.memo(App);
