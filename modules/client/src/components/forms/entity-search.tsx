/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo, useState, useCallback, useMemo, SyntheticEvent } from 'react';
import { DropdownProps, Form } from 'semantic-ui-react';

export interface AsyncSearcherResult {
  text: string;
  value: string | number;
}

export type EntitySearchValue =
  | string
  | number
  | boolean
  | undefined
  | (string | number | boolean)[];

export interface EntitySearchProps {
  value: EntitySearchValue;
  searcher: (query: string) => Promise<AsyncSearcherResult[]>;
  label?: string;
  onChange: (
    event: SyntheticEvent<HTMLElement, Event>,
    data: EntitySearchValue
  ) => void;
  disabled?: boolean;
  [key: string]: unknown;
}

const EntitySearch = (props: EntitySearchProps) => {
  const {
    value: originalValue,
    onChange: parentOnChange,
    searcher,
    label,
    disabled,
    ...rest
  } = props;
  const [value, setValue] = useState(originalValue);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AsyncSearcherResult[]>();

  const handleSearchChange = useCallback(
    async (e, data) => {
      setIsLoading(true);
      const searchResults = await searcher(data.searchQuery);
      setIsLoading(false);
      setResults(searchResults);
    },
    [searcher]
  );

  const onChange = useCallback(
    (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
      parentOnChange(event, data.value);
      setValue(data.value);
    },
    [parentOnChange]
  );

  useMemo(() => {
    handleSearchChange(null, { searchQuery: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, handleSearchChange]);

  return (
    <div className="field">
      {label && <label>{label}</label>}
      <Form.Dropdown
        clearable
        search
        selection
        loading={isLoading}
        onChange={onChange}
        onSearchChange={handleSearchChange}
        options={results}
        value={value}
        disabled={disabled}
        {...rest}
      />
    </div>
  );
};

export default memo(EntitySearch);
