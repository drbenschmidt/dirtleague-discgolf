import { DirtLeagueModel } from '@dirtleague/common';
import { useEffect } from 'react';

const useSubscription = <T>(
  model: DirtLeagueModel<unknown>,
  keyWatch: string,
  setter: (v: T) => void
): void => {
  useEffect(() => {
    const test = model.onChange.subscribe(props => {
      if (keyWatch === props.key) {
        setter(props.value);
      }
    });

    return () => test.unsubscribe();
  });
};

export default useSubscription;
