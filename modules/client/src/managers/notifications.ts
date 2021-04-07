import { LinkedList } from 'linked-list-typescript';
import { Subject } from 'rxjs';

export type NotificationType = 'error' | 'success';

export interface Notification {
  id: number;
  title: string;
  icon: string;
  message: string;
  type: string | 'error' | 'success'; // TODO: Hmm.
}

let nId = 0;

const getId = () => ++nId;

class NotificationsManager {
  notifications = new LinkedList<Notification>();

  onAdd = new Subject<Notification>();

  addError(message: string): void {
    const notification = {
      id: getId(),
      title: 'Error',
      icon: 'error',
      message,
      type: 'error',
    };

    this.notifications.append(notification);

    this.onAdd.next(notification);
  }
}

export default NotificationsManager;
