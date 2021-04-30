import React, { useContext } from 'react';
import RepositoryServices from './repository-services';

const context = React.createContext<RepositoryServices | null>(null);

export default context;

export const useRepositoryServices = (): RepositoryServices => {
  const value = useContext(context);

  if (!value) {
    throw new Error(
      'useRepositoryServices must be used within RepositoryServices context'
    );
  }

  return value;
};
