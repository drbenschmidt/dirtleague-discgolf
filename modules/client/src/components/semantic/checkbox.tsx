import { ReactElement, useCallback, useState, memo } from 'react';
import { Checkbox, CheckboxProps } from 'semantic-ui-react';

const StatefulCheckbox = (props: CheckboxProps): ReactElement => {
  const { checked: parentChecked, onChange: parentOnChanged, ...rest } = props;
  const [checked, setChecked] = useState(parentChecked);
  const onChange = useCallback(
    (event, data) => {
      setChecked(prev => !prev);
      parentOnChanged?.(event, data);
    },
    [parentOnChanged]
  );

  return <Checkbox {...rest} checked={checked} onChange={onChange} />;
};

export default memo(StatefulCheckbox);
