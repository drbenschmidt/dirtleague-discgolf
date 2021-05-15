import {
  CSSProperties,
  ReactElement,
  useCallback,
  useState,
  forwardRef,
  ForwardedRef,
} from 'react';
import {
  Form,
  FormFieldProps,
  Input,
  InputOnChangeData,
  Ref,
} from 'semantic-ui-react';

export interface TextInputProps extends FormFieldProps {
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  control?: unknown;
  type?: string;
  size?: string;
  style?: CSSProperties;
  label?: string;
}

const TextInput = forwardRef<HTMLElement, TextInputProps>(
  (props: TextInputProps, ref: ForwardedRef<HTMLElement>): ReactElement => {
    const {
      value: originalValue,
      onChange: parentOnChange,
      control = Input,
      ...rest
    } = props;
    const [value, setValue] = useState(originalValue);

    const onChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
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

    return (
      <Ref innerRef={ref}>
        <Form.Field {...inputProps} />
      </Ref>
    );
  }
);

export default TextInput;
