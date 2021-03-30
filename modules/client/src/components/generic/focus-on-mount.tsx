import { useRef, useEffect, ReactElement, MutableRefObject } from 'react';
import { getHtmlInput } from '@dirtleague/common';

export interface FocusOnMountProps {
  children: (ref: MutableRefObject<HTMLElement | undefined>) => ReactElement;
}

const FocusOnMount = (props: FocusOnMountProps): ReactElement => {
  const { children } = props;
  const componentRef = useRef<HTMLElement>();

  useEffect(() => {
    const element = getHtmlInput(componentRef);
    element?.focus();
  }, []);

  return children(componentRef);
};

export default FocusOnMount;
