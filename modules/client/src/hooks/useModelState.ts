import { DirtLeagueModel } from '@dirtleague/common';
import { Dispatch, SetStateAction, useState } from 'react';
import useSubscription from './useSubscription';

const useModelState = <T>(
  model: DirtLeagueModel<unknown>,
  prop: string
): [T, Dispatch<SetStateAction<T>>] => {
  const value = model.get<T>(prop);
  const state = useState(value);
  useSubscription(model, prop, state[1]);

  return state;
};

export default useModelState;
