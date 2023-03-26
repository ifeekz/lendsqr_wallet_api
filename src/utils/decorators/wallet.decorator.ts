import { Wallet } from '@/interfaces/wallets.interface';
import { Wallets } from '@/models/wallet.model';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsValidWalletConstraint implements ValidatorConstraintInterface {
  async validate(walletId: any) {
    const wallet: Wallet = await Wallets.query().select().from('wallets').where('wallet_id', '=', walletId).first();
    if (!wallet) return false;
    return true;
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
