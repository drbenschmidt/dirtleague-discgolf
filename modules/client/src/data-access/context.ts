import React, { useContext } from 'react';
import RepositoryServices from './repositories';

const context = React.createContext<RepositoryServices | null>(null);

export default context;

export const useRepositoryServices = (): RepositoryServices | null => {
  const value = useContext(context);

  return value;
};
