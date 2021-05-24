import { createContext, useContext } from 'react';
import ApiFetch from '../data-access/api-fetch';

export interface ErrorManagerProps {
  api: ApiFetch;
}

export interface ClientErrorResponse {
  success: boolean;
}

// TODO: Generate a sessionId so we can tie errors together.
class ErrorManager {
  api: ApiFetch;

  constructor(props: ErrorManagerProps) {
    const { api } = props;

    this.api = api;
  }

  reportJsError = async (error: Error): Promise<void> => {
    const payload = {
      message: error.message,
      meta: {
        errorType: 'js',
        stack: error.stack,
      },
    };

    const response = await this.api.post<ClientErrorResponse>(
      'clientErrors',
      payload
    );

    if (!response.success) {
      console.error('reportJsError failed!', payload);
    }
  };

  reportReactError = async (
    error: Error,
    componentStack: string
  ): Promise<void> => {
    const payload = {
      message: error.message,
      meta: {
        errorType: 'react',
        stack: error.stack,
        componentStack,
      },
    };

    const response = await this.api.post<ClientErrorResponse>(
      'clientErrors',
      payload
    );

    if (!response.success) {
      console.error('reportReactError failed!', payload);
    }
  };
}

export const ErrorManagerContext = createContext<ErrorManager | null>(null);

export const useErrorManager = (): ErrorManager => {
  const errorManager = useContext(ErrorManagerContext);

  if (!errorManager) {
    throw new Error('useErrorManager must be used within the ErrorContext!');
  }

  return errorManager;
};

export default ErrorManager;
