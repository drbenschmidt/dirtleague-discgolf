import { ReactElement, useCallback, useState } from 'react';
import { Form, Input } from 'semantic-ui-react';

const TextInput = (props: any): ReactElement => {
  const {
    value: originalValue,
    onChange: parentOnChange,
    control = Input,
    ...rest
  } = props;
  const [value, setValue] = useState(originalValue);

  const onChange = useCallback(
    (event, data) => {
      const { value: newValue } = data;
      setValue(newValue);
      parentOnChange(event, data);
    },
    [parentOnChange]
  );

  const inputProps = {
    ...rest,
    value,
    onChange,
    control,
  };

  return <Form.Field {...inputProps} />;
};

export default TextInput;
