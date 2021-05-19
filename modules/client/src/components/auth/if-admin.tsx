import { Role, includesAny } from '@dirtleague/common';
import React, { ReactElement } from 'react';
import { useAuthContext } from './context';

interface IfAuthorizedProps extends React.PropsWithChildren<unknown> {
  roles?: Role[];
  or?: () => boolean;
}

const IfAuthorized = (props: IfAuthorizedProps): ReactElement | null => {
  const { children, or, roles = [] } = props;
  const authContext = useAuthContext();

  if (!authContext.user) {
    return null;
  }

  if (!authContext?.isAuthenticated) {
    return null;
  }

  const userRoles = authContext.user.roles;
  const rolesInclude = includesAny(userRoles, [...roles, Role.Admin]);

  if (rolesInclude || or?.()) {
    return <>{children}</>;
  }

  return null;
};

export default IfAuthorized;
