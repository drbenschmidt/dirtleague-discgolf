import { memo, useRef, useCallback } from 'react';
import { Button } from 'semantic-ui-react';

const FileUploadComponent = (props: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const onClick = useCallback(() => {
    inputRef.current?.click();
  }, []);
  const onChange = useCallback((e: any) => {
    console.log(e);
    console.log(e.target.files[0]);
  }, []);

  return (
    <>
      <Button
        content="Choose File"
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
