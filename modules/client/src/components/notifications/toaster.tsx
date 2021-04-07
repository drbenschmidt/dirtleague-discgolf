import { useCallback, useEffect, useState, ReactElement } from 'react';
import { useNotificationsContext } from './context';
import type { Notification } from '../../managers/notifications';
import Toast from './toast';
import './toaster.css';

const Toaster = (): ReactElement => {
  const [, setDummy] = useState(true);
  const manager = useNotificationsContext();

  useEffect(() => {
    const subscription = manager.onAdd.subscribe(() => {
      setDummy(d => !d);
    });

    return () => subscription.unsubscribe();
  }, [manager.onAdd]);

  const onDismiss = useCallback(
    (model: Notification) => {
      if (manager.notifications.length === 1) {
        manager.notifications.removeHead();
      } else {
        manager.notifications.remove(model);
      }
      setDummy(d => !d);
    },
    [manager.notifications]
  );

  const notifications = manager.notifications.toArray();

  return (
    <div className="toaster">
      {notifications.map(n => (
        <Toast key={n.id} model={n} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default Toaster;
