import { ReactElement, useCallback, useState, memo } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';

export interface DeleteEntityButtonProps {
  id: number;
  modelName: string;
  onDelete: (id: number) => Promise<void>;
}

const DeleteEntityButton = (props: DeleteEntityButtonProps): ReactElement => {
  const { onDelete, modelName, id } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isInFlight, setIsInFlight] = useState(false);

  const button = (
    <Button negative size="mini">
      <Icon name="delete" />
      Delete
    </Button>
  );

  const onYesClick = useCallback(() => {
    const deleteEntity = async () => {
      try {
        setIsInFlight(true);
        await onDelete(id);
        setIsOpen(false);
      } finally {
        setIsInFlight(false);
      }
    };

    deleteEntity();
  }, [onDelete, id]);

  return (
    <Modal
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={button}
    >
      <Modal.Header>Delete {modelName}</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete this {modelName}?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button disabled={isInFlight} onClick={() => setIsOpen(false)} negative>
          No
        </Button>
        <Button loading={isInFlight} onClick={onYesClick} positive>
          Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default memo(DeleteEntityButton);
