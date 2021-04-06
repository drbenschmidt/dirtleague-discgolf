import type { ValidationError } from 'class-validator';
import { Validatable } from '@dirtleague/common';
import { useCallback } from 'react';
import { useNotificationsContext } from '../components/notifications/context';

const getErrorValue = (error: ValidationError) =>
  Object.values(error.constraints || {}).join(', ');

const useModelValidation = (model: Validatable): (() => Promise<boolean>) => {
  const notifications = useNotificationsContext();

  return useCallback(async () => {
    const result = await model.validate();

    if (result.length === 0) {
      return true;
    }

    result.forEach(error => notifications.addError(getErrorValue(error)));

    return false;
  }, [model, notifications]);
};

export default useModelValidation;
