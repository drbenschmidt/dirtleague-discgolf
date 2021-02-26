import { useRef, useCallback, ChangeEvent } from 'react';
import { InputOnChangeData } from 'semantic-ui-react';
import { deepClone } from '@dirtleague/common';

export interface Transaction<TModel> {
  model: React.RefObject<TModel>;
  revertModel: () => void;
}

export interface InputBinding {
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  content: string;
}

export const useTransaction = <TModel>(
  original: TModel
): Transaction<TModel> => {
  const clone = deepClone(original);
  const model = useRef<TModel>(clone);
  const revert = () => {
    model.current = deepClone(original);
  };

  return {
    model,
    revertModel: revert,
  };
};

export const useInputBinding = <TModel extends Record<string, any>>(
  modelRef: React.RefObject<TModel>,
  propName: string
): InputBinding => {
  const content = (modelRef.current as any)[propName];

  const onChange = useCallback(
    (_event, { value }) => {
      // TODO: Figure out how to get TS to like this.
      // eslint-disable-next-line no-param-reassign
      (modelRef.current as any)[propName] = value;
    },
    [modelRef, propName]
  );

  return {
    onChange,
    content,
  };
};
