import { useRef, useEffect, ReactElement, RefObject } from 'react';
import { getHtmlInput } from '@dirtleague/common';

export interface FocusOnMountProps {
  children: (ref: RefObject<HTMLElement>) => ReactElement;
}

const FocusOnMount = (props: FocusOnMountProps): ReactElement => {
  const { children } = props;
  const componentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = getHtmlInput(componentRef);
    element?.focus();
  }, []);

  return children(componentRef);
};

export default FocusOnMount;
