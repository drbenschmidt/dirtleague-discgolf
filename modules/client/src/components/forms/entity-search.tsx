/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { Search, Label } from 'semantic-ui-react';

const resultRenderer = (props: any) => <Label content={props.title} />;

export interface AsyncSearcherResult {
  title: string;
}

export interface EntitySearchProps {
  value: any;
  searcher: (query: string) => Promise<AsyncSearcherResult[]>;
  label: string;
}

const EntitySearch = (props: EntitySearchProps) => {
  const { value, searcher, label } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AsyncSearcherResult[]>();
  const timeoutRef = useRef<number>();

  const handleSearchChange = useCallback(
    async (e, data) => {
      clearTimeout(timeoutRef.current);
      setIsLoading(true);
      const searchResults = await searcher(data.value);
      setIsLoading(false);
      setResults(searchResults);
    },
    [searcher]
  );

  return (
    <div className="field">
      <label>{label}</label>
      <Search
        loading={isLoading}
        onResultSelect={(e, data) =>
          console.log({ type: 'UPDATE_SELECTION', selection: data.result.name })
        }
        onSearchChange={handleSearchChange}
        resultRenderer={resultRenderer}
        results={results}
        value={value}
      />
    </div>
  );
};

export default memo(EntitySearch);
