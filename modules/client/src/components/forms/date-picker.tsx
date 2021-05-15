import { ReactElement, useCallback, memo } from 'react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { SemanticDatepickerProps } from 'react-semantic-ui-datepickers/dist/types';

export interface DatePickerProps {
  value: Date | Date[] | null | undefined;
  onChange?: (value: Date | Date[] | null | undefined) => void;
  label?: string;
  pickerProps?: SemanticDatepickerProps;
}

const DatePicker = (props: DatePickerProps): ReactElement => {
  const {
    value: originalValue,
    onChange: parentOnChange,
    pickerProps,
    label,
  } = props;
  const onChange = useCallback(
    (
      _event: React.SyntheticEvent | undefined,
      data: SemanticDatepickerProps
    ) => {
      parentOnChange?.(data.value);
    },
    [parentOnChange]
  );

  return (
    <SemanticDatepicker
      {...pickerProps}
      label={label}
      value={originalValue}
      onChange={onChange}
      type="basic"
    />
  );
};

export default memo(DatePicker);
