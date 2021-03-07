import { ReactElement, useCallback, useState } from 'react';
import { Form } from 'semantic-ui-react';

const SelectInput = (props: any): ReactElement => {
  const { value: originalValue, onChange: parentOnChange, ...rest } = props;
  const [value, setValue] = useState(originalValue);

  const onChange = useCallback(
    (event, { value: newValue }) => {
      setValue(newValue);
      parentOnChange?.(event, newValue);
    },
    [parentOnChange]
  );

  const controlProps = {
    ...rest,
    value,
    onChange,
  };

  return <Form.Dropdown selection {...controlProps} />;
};

export default SelectInput;
