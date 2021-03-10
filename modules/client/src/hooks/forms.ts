import React, { useRef, useCallback, useMemo, ChangeEvent } from 'react';
import { InputOnChangeData } from 'semantic-ui-react';
import { Cloneable, deepClone } from '@dirtleague/common';

export interface Transaction<TModel> {
  model: React.RefObject<TModel | undefined>;
  revertModel: () => void;
}

export interface InputBinding {
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  value: string;
}

function orDefault<T>(obj: T) {
  return obj || ({} as T);
}

export const useTransaction = <TModel extends Cloneable<TModel>>(
  original: TModel | undefined
): Transaction<TModel> => {
  const clone = useMemo(() => {
    return original?.clone() ?? deepClone(orDefault(original));
  }, [original]);
  const model = useRef(clone);
  const revert = () => {
    model.current = deepClone(original);
  };

  model.current = clone;

  return {
    model,
    revertModel: revert,
  };
};

export const useInputBinding = <TModel extends Record<string, any> | undefined>(
  modelRef: React.RefObject<TModel>,
  propName: string
): InputBinding => {
  const originalValue = (modelRef.current as any)[propName];

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
    value: originalValue,
  };
};

export const useSelectBinding = <
  TModel extends Record<string, any> | undefined
>(
  modelRef: React.RefObject<TModel>,
  propName: string
): InputBinding => {
  const originalValue = (modelRef.current as any)[propName];

  const onChange = useCallback(
    (_event, value) => {
      // TODO: Figure out how to get TS to like this.
      // eslint-disable-next-line no-param-reassign
      (modelRef.current as any)[propName] = value;
    },
    [modelRef, propName]
  );

  return {
    onChange,
    value: originalValue,
  };
};
