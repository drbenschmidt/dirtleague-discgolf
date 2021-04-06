import { ReactElement, useCallback } from 'react';
import { Message } from 'semantic-ui-react';
import type { Notification } from '../../managers/notifications';

const { assign } = Object;

export interface ToastProps {
  model: Notification;
  onDismiss: (model: Notification) => void;
}

const Toast = (props: ToastProps): ReactElement => {
  const { model, onDismiss: onParentDismiss } = props;
  const { type, title, message } = model;

  const onDismiss = useCallback(() => {
    onParentDismiss(model);
  }, [model, onParentDismiss]);

  const messageProps = {
    floating: true,
    onDismiss,
  };

  // eslint-disable-next-line default-case
  switch (type) {
    case 'error':
      assign(messageProps, { negative: true });
      break;

    case 'success':
      assign(messageProps, { positive: true });
      break;
  }

  return (
    <Message {...messageProps}>
      <Message.Header>{title}</Message.Header>
      <p>{message}</p>
    </Message>
  );
};

export default Toast;
