import React, { ReactElement, useCallback } from 'react';
import { Icon, Message, SemanticICONS } from 'semantic-ui-react';
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
    icon: true,
    onDismiss,
  };

  let iconName: SemanticICONS = 'chain';

  // eslint-disable-next-line default-case
  switch (type) {
    case 'error':
      assign(messageProps, { negative: true });
      iconName = 'exclamation circle';
      break;

    case 'success':
      assign(messageProps, { positive: true });
      iconName = 'thumbs up outline';
      break;
  }

  return (
    <Message {...messageProps}>
      <Icon name={iconName} />
      <Message.Content>
        <Message.Header>{title}</Message.Header>
        <p>{message}</p>
      </Message.Content>
    </Message>
  );
};

export default Toast;
