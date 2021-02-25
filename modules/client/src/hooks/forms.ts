import { useRef, useCallback, ChangeEvent } from 'react';
import { InputOnChangeData } from 'semantic-ui-react';
import { deepClone } from '@dirtleague/common';

export interface Transaction<TModel> {
  model: React.RefObject<TModel>;
  revertModel: Function;
}

export interface InputBinding {
  onChange: (event: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void;
  content: string;
}

export const useTransaction = <TModel>(original: TModel): Transaction<TModel> => {
  const clone = deepClone(original);
  const model = useRef<TModel>(clone);
  const revert = () => model.current = deepClone(original);

  return {
    model,
    revertModel: revert,
  };
};

export const useInputBinding = <TModel>(modelRef: React.RefObject<TModel>, propName: string): InputBinding => {
  const content = (modelRef.current as any)[propName];

  const onChange = useCallback((_event, { value }) => {
    (modelRef.current as any)[propName] = value;
  }, [modelRef, propName]);

  return {
    onChange,
    content,
  };
};