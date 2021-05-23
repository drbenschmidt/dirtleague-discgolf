import 'semantic-ui-css/semantic.min.css';
import { useState, useEffect, memo, ReactElement } from 'react';
import useOnce from './hooks/useOnce';
import AuthContext from './components/auth/context';
import ErrorBoundary from './components/error-boundary';
import RepositoryContext from './data-access/context';
import AuthManager from './managers/auth';
import ApiFetch from './data-access/api-fetch';
import Router from './router';
import RepositoryServices from './data-access/repository-services';
import ErrorManager, { ErrorManagerContext } from './managers/error';
import { NotificationsProvider } from './components/notifications/context';

const Fallback = (): ReactElement => {
  return (
    <div>
      <h1>Oh no!</h1>
      <p>
        An uncaught error occurred. Try refreshing, and if it still happens,
        yell at an Admin.
      </p>
    </div>
  );
};

const App = (): ReactElement | null => {
  const apiFetch = useOnce(() => ApiFetch.CreateFromLocalStorage());
  const authManager = useOnce(() => new AuthManager(apiFetch));
  const repositoryServices = useOnce(
    () => new RepositoryServices({ api: apiFetch })
  );
  const errorManager = useOnce(() => {
    const result = new ErrorManager({ api: apiFetch });
    window.onerror = (
      event: string | Event,
      source?: string | undefined,
      lineno?: number | undefined,
      colno?: number | undefined,
      error?: Error | undefined
    ) => {
      if (error) {
        result.reportJsError(error);
      }
    };
    return result;
  });
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
    return <h3>Loading...</h3>;
  }

  return (
    <ErrorManagerContext.Provider value={errorManager}>
      <RepositoryContext.Provider value={repositoryServices}>
        <AuthContext.Provider value={authManager}>
          <NotificationsProvider>
            <ErrorBoundary FallbackComponent={Fallback}>
              <Router />
            </ErrorBoundary>
          </NotificationsProvider>
        </AuthContext.Provider>
      </RepositoryContext.Provider>
    </ErrorManagerContext.Provider>
  );
};

export default memo(App);
