import React, { useContext } from 'react';
import NotificationsManager from '../../managers/notifications';

export const notificationsManagerInstance = new NotificationsManager();

const NotificationsContext = React.createContext<NotificationsManager>(
  notificationsManagerInstance
);

export default NotificationsContext;

export const useNotificationsContext = (): NotificationsManager => {
  const value = useContext(NotificationsContext);

  return value;
};

export const NotificationsProvider = (props: any) => {
  const { children } = props;

  return (
    <NotificationsContext.Provider value={notificationsManagerInstance}>
      {children}
    </NotificationsContext.Provider>
  );
};
