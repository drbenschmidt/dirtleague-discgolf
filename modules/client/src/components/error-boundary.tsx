import { PropsWithChildren, useCallback, ReactElement } from 'react';
import {
  ErrorBoundary as ReactErrorBoundary,
  ErrorBoundaryProps,
} from 'react-error-boundary';
import { useErrorManager } from '../managers/error';

const ErrorBoundary = (
  props: PropsWithChildren<ErrorBoundaryProps>
): ReactElement => {
  const { children } = props;
  const errorManager = useErrorManager();
  const onError = useCallback(
    (error: Error, info: { componentStack: string }) => {
      errorManager.reportReactError(error, info.componentStack);
    },
    [errorManager]
  );

  return (
    <ReactErrorBoundary {...props} onError={onError}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
