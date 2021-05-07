import { Roles } from '@dirtleague/common';
import React, { ReactElement } from 'react';
import { useAuthContext } from './context';

interface IfAdminProps extends React.PropsWithChildren<unknown> {
  or?: () => boolean;
}

const IfAdmin = (props: IfAdminProps): ReactElement | null => {
  const { children, or } = props;
  const authContext = useAuthContext();

  if (!authContext?.isAuthenticated) {
    return null;
  }

  if (authContext.user?.roles.includes(Roles.Admin) || or?.()) {
    return <>{children}</>;
  }

  return null;
};

export default IfAdmin;
