import React, { useContext } from 'react';
import AuthManager from '../../managers/auth';

const context = React.createContext<AuthManager | null>(null);

export default context;

export const useAuthContext = (): AuthManager => {
  const value = useContext(context);

  if (!value) {
    throw new Error("useAuthContext must be used within it's react context");
  }

  return value;
};
