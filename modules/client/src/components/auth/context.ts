import React, { useContext } from 'react';
import AuthManager from '../../managers/auth';

const context = React.createContext<AuthManager | null>(null);

export default context;

export const useAuthContext = (): AuthManager | null => {
  const value = useContext(context);

  return value;
};
