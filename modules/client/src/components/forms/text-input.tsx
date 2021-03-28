import { CSSProperties, ReactElement, useCallback, useState } from 'react';
import { Form, FormFieldProps, Input } from 'semantic-ui-react';

export interface TextInputProps extends FormFieldProps {
  value: any;
  onChange: (event: any, data: any) => void;
  control?: any;
  type?: string;
  size?: string;
  style?: CSSProperties;
  label?: string;
}

const TextInput = (props: TextInputProps): ReactElement => {
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
