import { ReactElement, useCallback } from 'react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { SemanticDatepickerProps } from 'react-semantic-ui-datepickers/dist/types';

const DatePicker = (props: any): ReactElement => {
  const { value: originalValue, onChange: parentOnChange, ...rest } = props;
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
      {...rest}
      value={originalValue}
      onChange={onChange}
      type="basic"
    />
  );
};

export default DatePicker;
