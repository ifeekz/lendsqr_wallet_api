import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import knex from '@databases';

@ValidatorConstraint({ async: false })
export class Unique implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    const row = await knex(args.constraints[0])
      .where(args.constraints[1], value)
      .select('id')
      .first();

    if (row) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return '$value already exist';
  }
}
