import React, { useContext } from 'react';
import AuthManager from '../../managers/auth';

const context = React.createContext(new AuthManager());

export default context;

export const useAuthContext = () => {
  const value = useContext(context);

  return value;
};
