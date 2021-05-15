import { memo, ReactElement, useCallback, useState, useMemo } from 'react';
import { DropdownItemProps, DropdownProps, Form } from 'semantic-ui-react';

export interface SelectInputProps {
  value: boolean | number | string | (boolean | number | string)[];
  onChange: (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) => void;
  options: DropdownItemProps[];
  label?: string;
  dropdownProps?: DropdownProps;
}

const SelectInput = (props: SelectInputProps): ReactElement => {
  const {
    value: originalValue,
    onChange: parentOnChange,
    label,
    dropdownProps,
    options,
  } = props;
  const [value, setValue] = useState(originalValue);

  const onChange = useCallback(
    (event, { value: newValue }) => {
      setValue(newValue);
      parentOnChange?.(event, newValue);
    },
    [parentOnChange]
  );

  const controlProps = useMemo(
    () => ({
      ...dropdownProps,
      label,
      value,
      onChange,
      options,
    }),
    [dropdownProps, label, onChange, options, value]
  );

  return <Form.Dropdown selection {...controlProps} />;
};

export default memo(SelectInput);
