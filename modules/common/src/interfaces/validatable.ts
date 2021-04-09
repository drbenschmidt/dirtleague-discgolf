import { ValidationError } from 'class-validator';

export const onlyClient = { groups: ['client'] };
export const onlyServer = { groups: ['server'] };
export const fullValidation = { groups: ['client', 'server'] };

interface Validatable {
  validate(): Promise<ValidationError[]>;
}

export default Validatable;
