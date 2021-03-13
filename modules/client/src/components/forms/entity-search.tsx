/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { Form } from 'semantic-ui-react';
import useOnce from '../../hooks/useOnce';

export interface AsyncSearcherResult {
  text: string;
  value: string | number;
}

export interface EntitySearchProps {
  value: any;
  searcher: (query: string) => Promise<AsyncSearcherResult[]>;
  label: string;
  onChange: (event: any, value: any) => void;
}

const EntitySearch = (props: EntitySearchProps) => {
  const {
    value: originalValue,
    onChange: parentOnChange,
    searcher,
    label,
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
    (e, data) => {
      parentOnChange(e, data.value);
      setValue(data.value);
    },
    [parentOnChange]
  );

  useOnce(() => {
    handleSearchChange(null, { searchQuery: '' });
  });

  return (
    <div className="field">
      <label>{label}</label>
      <Form.Dropdown
        clearable
        search
        selection
        loading={isLoading}
        onChange={onChange}
        onSearchChange={handleSearchChange}
        options={results}
        value={value}
      />
    </div>
  );
};

export default memo(EntitySearch);
