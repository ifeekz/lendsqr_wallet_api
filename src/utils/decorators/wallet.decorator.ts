import walletService from '@services/wallets.service';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsValidWalletConstraint implements ValidatorConstraintInterface {
  async validate(walletId: any) {
    const service = new walletService();
    return await service.isValidWalletId(walletId);
  }
}

export function IsValidWallet(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidWalletConstraint,
    });
  };
}
