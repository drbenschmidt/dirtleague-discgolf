import { ValidationError } from 'class-validator';

interface Validatable {
  validate(): Promise<ValidationError[]>;
}

export default Validatable;
