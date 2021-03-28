import { ReactElement, useState } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import FileUpload from '../../../components/forms/file-upload';

interface UploadButtonProps {
  disabled: boolean;
  formData: FormData;
  formPropName: string;
  onUpload: () => Promise<void>;
}

const UploadButton = (props: UploadButtonProps): ReactElement => {
  const { formData, formPropName, onUpload, disabled } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isInFlight, setIsInFlight] = useState(false);

  const button = (
    <Button primary as="a" disabled={disabled}>
      <Icon name="cloud upload" />
      Upload uDisc CSV
    </Button>
  );

  return (
    <Modal
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={button}
    >
      <Modal.Header>Upload File</Modal.Header>
      <Modal.Content>
        <FileUpload formData={formData} formPropName={formPropName} />
      </Modal.Content>
      <Modal.Actions>
        <Button disabled={isInFlight} onClick={() => setIsOpen(false)} negative>
          Cancel
        </Button>
        <Button
          loading={isInFlight}
          onClick={async () => {
            try {
              setIsInFlight(true);
              await onUpload();
              setIsOpen(false);
            } finally {
              setIsInFlight(false);
            }
          }}
          positive
        >
          Upload
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UploadButton;
