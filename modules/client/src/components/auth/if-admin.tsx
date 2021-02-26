import { Roles } from '@dirtleague/common';
import { ReactElement } from 'react';
import { useAuthContext } from './context';

const IfAdmin = (props: { children: any }): ReactElement | null => {
  const { children } = props;
  const authContext = useAuthContext();

  if (!authContext?.isAuthenticated) {
    return null;
  }

  if (authContext.user?.roles.includes(Roles.Admin)) {
    return children;
  }

  return null;
};

export default IfAdmin;
