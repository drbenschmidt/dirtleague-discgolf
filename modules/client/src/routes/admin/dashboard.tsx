import { ReactElement } from 'react';
import { Message } from 'semantic-ui-react';

const AdminDashboard = (): ReactElement => {
  return (
    <Message>
      <Message.Header>Admin Panel</Message.Header>
      <p>
        This message is here really because I needed a placeholder for a side
        menu
      </p>
    </Message>
  );
};

export default AdminDashboard;
