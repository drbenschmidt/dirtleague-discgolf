import React, {
  useRef,
  useCallback,
  useMemo,
  ChangeEvent,
  SyntheticEvent,
  RefObject,
} from 'react';
import { InputOnChangeData } from 'semantic-ui-react';
import { Cloneable, deepClone, get, set } from '@dirtleague/common';
import { EntitySearchValue } from '../components/forms/entity-search';

export interface Transaction<TModel> {
  model: React.RefObject<TModel>;
  revertModel: () => void;
}

export interface InputBinding {
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  value: string;
}

export interface SelectBinding {
  onChange: (
    event: SyntheticEvent<HTMLElement, Event>,
    data: EntitySearchValue
  ) => void;
  value: string;
}

export interface DateBinding {
  onChange: (value: Date | Date[] | null | undefined) => void;
  value: Date | Date[] | null | undefined;
}

function orDefault<T>(obj: T) {
  return obj || ({} as T);
}

export const useTransaction = <TModel extends Cloneable<TModel>>(
  original: TModel
): Transaction<TModel> => {
  const clone = useMemo(() => {
    return original.clone() ?? deepClone(orDefault(original));
  }, [original]);
  const model = useRef<TModel>(clone);
  const revertModel = useCallback(() => {
    model.current = original.clone() ?? deepClone(orDefault(original));
  }, [original]);

  model.current = clone;

  return {
    model,
    revertModel,
  };
};

export const useInputBinding = <TModel>(
  modelRef: RefObject<TModel>,
  propName: string
): InputBinding => {
  const originalValue = get<string>(modelRef.current, propName);

  const onChange = useCallback(
    (_event, { value }) => {
      set(modelRef.current, propName, value);
    },
    [modelRef, propName]
  );

  return {
    onChange,
    value: originalValue ?? '',
  };
};

export const useSelectBinding = <TModel>(
  modelRef: RefObject<TModel>,
  propName: string
): SelectBinding => {
  const originalValue = get<string>(modelRef.current, propName);

  const onChange = useCallback(
    (event: SyntheticEvent<HTMLElement, Event>, value: EntitySearchValue) => {
      set(modelRef.current, propName, value);
    },
    [modelRef, propName]
  );

  return {
    onChange,
    value: originalValue ?? '',
  };
};

export const useDateBinding = <TModel>(
  modelRef: RefObject<TModel>,
  propName: string
): DateBinding => {
  const originalValue = get<Date>(modelRef.current, propName);

  const onChange = useCallback(
    (value: Date | Date[] | null | undefined) => {
      set(modelRef.current, propName, value);
    },
    [modelRef, propName]
  );

  return {
    onChange,
    value: originalValue,
  };
};
