import { memo, useRef, useCallback, useState } from 'react';
import { Button } from 'semantic-ui-react';

interface FileUploadComponentProps {
  formData: FormData;
  formPropName: string;
}

const FileUploadComponent = (props: FileUploadComponentProps) => {
  const { formData, formPropName } = props;
  const [fileName, setFileName] = useState();
  const inputRef = useRef<HTMLInputElement>(null);
  const onClick = useCallback(() => {
    inputRef.current?.click();
  }, []);
  const onChange = useCallback(
    (e: any) => {
      const file = e.target.files[0];
      console.log(file);

      formData.append(formPropName, file);

      setFileName(file.name);
    },
    [formData, formPropName]
  );

  return (
    <>
      <Button
        content={fileName ?? 'Choose File'}
        labelPosition="left"
        icon="file"
        onClick={onClick}
        as="a"
      />
      <input ref={inputRef} type="file" hidden onChange={onChange} />
    </>
  );
};

export default memo(FileUploadComponent);
