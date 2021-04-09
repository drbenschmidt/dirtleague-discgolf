import type { ValidationError } from 'class-validator';
import { Validatable } from '@dirtleague/common';
import { useCallback, RefObject } from 'react';
import { useNotificationsContext } from '../components/notifications/context';

const getErrorValue = (error: ValidationError) =>
  Object.values(error.constraints || {}).join(', ');

const flattenErrors = (errors: ValidationError[]): ValidationError[] => {
  return errors.flatMap(error => {
    if (error.children && error.children.length > 0) {
      return flattenErrors(error.children);
    }

    return [error];
  });
};

const useModelValidation = (
  model: RefObject<Validatable>
): (() => Promise<boolean>) => {
  const notifications = useNotificationsContext();

  return useCallback(async () => {
    if (!model.current) {
      return true;
    }

    const result = await model.current?.validate();

    if (result.length === 0) {
      return true;
    }

    const errors = flattenErrors(result);

    errors.forEach(error => notifications.addError(getErrorValue(error)));

    return false;
  }, [model, notifications]);
};

export default useModelValidation;
