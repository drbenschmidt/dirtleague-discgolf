import { Roles } from '@dirtleague/common';
import React, { ReactElement } from 'react';
import { useAuthContext } from './context';

interface IfAdminProps extends React.PropsWithChildren<unknown> {
  or?: () => boolean;
}

const IfAdmin = (props: IfAdminProps): ReactElement | null => {
  const { children, or } = props;
  const authContext = useAuthContext();
  const roles = authContext?.user?.roles;
  const rolesInclude = roles?.includes(Roles.Admin);

  if (!authContext?.isAuthenticated) {
    return null;
  }

  if (rolesInclude || or?.()) {
    return <>{children}</>;
  }

  return null;
};

export default IfAdmin;
